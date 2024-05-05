const expressAsyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
const csrf = require("csrf")()
const Token = require("../models/tokenModel")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(
	process.env.googleClientID,
	process.env.googleClientSecret
)
const axios = require("axios")

const get = expressAsyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.session.user._id).select(
			"-password"
		)
		const { fullname, email, username, _id, avatar } = user
		res.status(200).json({
			_id,
			fullname,
			email,
			username,
			avatar,
		})
	} catch (error) {
		console.log(error)
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const login = expressAsyncHandler(async (req, res) => {
	try {
		if (!req.body?.email && !req.body?.password) {
			res.status(400)
			throw new Error("Please fill all fields")
		}
		const { email, password } = req.body
		try {
			const user = await User.findOne({ email })
			if (!user) {
				return res.status(401).json({ error: "Invalid credentials" })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(401).json({ error: "Invalid credentials" })
			}

			const { _id, fullname, username, avatar } = user
			const csrfSecret = await csrf.secret()
			const csrfToken = csrf.create(csrfSecret)

			req.session.user = { ...user._doc, csrfSecret }

			await Token.create({
				user: user.id,
				clientSideCookie: csrfSecret,
			})

			res.status(200).json({
				_id,
				fullname,
				email,
				username,
				csrfToken,
				avatar,
			})
		} catch (error) {
			res.status(500).json({ error: "Login failed" })
		}
	} catch (error) {
		res.status(422)
		if (error.message === "Invalid credentials")
			throw new Error(error.message)
		else throw new Error("Something went wrong")
	}
})
const logout = expressAsyncHandler(async (req, res) => {
	if (req?.session?.user) {
		if (req?.session?.user?.credential) {
			try {
				client.revokeToken(req.session.user.credential)
			} catch (e) {
				throw new Error(
					"There was an issue while attempting to log out. Please try again."
				)
			}
		}

		if (req?.session?.user?.accessToken) {
			try {
				const response = await axios.delete(
					`https://graph.facebook.com/v12.0/me/permissions`,
					{
						params: {
							access_token: req?.session?.user?.accessToken,
						},
					}
				)
				if (!response?.data?.success)
					throw new Error(
						"There was an issue while attempting to log out. Please try again."
					)
			} catch (e) {
				throw new Error(
					"There was an issue while attempting to log out. Please try again."
				)
			}
		}

		await Token.findOneAndDelete({ user: req.session.user, active: true })
		req.session.destroy()
		res.status(200).json({})
	}
})
const register = expressAsyncHandler(async (req, res) => {
	if (!req.body?.email && !req.body?.password) {
		res.status(400)
		throw new Error("Please fill all fields")
	}

	const email = req.body.email.toLowerCase()

	const userExist = await User.findOne({ email })
	if (userExist) {
		res.status(400)
		throw new Error("Email already exists")
	}

	const salt = await bcrypt.genSalt(10)
	const password = await bcrypt.hash(req.body.password, salt)
	const fullname = req.body.fullname

	const user = await User.create({ fullname, email, password })

	if (user) {
		login(req, res)
	} else {
		res.status(400)
		throw new Error("Invalid user data")
	}
})
const saveProfile = expressAsyncHandler(async (req, res) => {
	try {
		if (!req.body?.email && !req.body?.username) {
			res.status(400)
			throw new Error("Please fill all fields")
		}
		const { fullname, username, email } = req.body
		const usernameOrEmailExist = await User.findOne({
			$or: [{ username }, { email }],
			_id: { $ne: req.session.user._id },
		})
		if (usernameOrEmailExist) {
			if (usernameOrEmailExist.username === username)
				res.status(400).json({ error: "Username already exists" })
			else if (usernameOrEmailExist.email === email)
				res.status(400).json({ error: "Email already exists" })
			else res.status(400).json({ error: "Something went wrong" })
		} else {
			const updatedUser = await User.findByIdAndUpdate(
				req.session.user._id,
				{
					fullname,
					username,
					email,
				},
				{ new: true }
			)
			if (updatedUser)
				res.status(200).json({
					_id: updatedUser._id,
					fullname: updatedUser.fullname,
					email: updatedUser.email,
					username: updatedUser.username,
				})
			else res.status(400).json({ error: "Something went wrong" })
		}
	} catch (error) {
		console.log(error)
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const savePassword = expressAsyncHandler(async (req, res) => {
	try {
		if (!req.body?.password && !req.body?.newPassword) {
			res.status(400)
			throw new Error("Please fill all fields")
		}
		const { password, newPassword } = req.body
		const user = await User.findById(req.session.user._id)
		if (user && (await bcrypt.compare(password, user.password))) {
			const salt = await bcrypt.genSalt(10)
			const hashedNewPassword = await bcrypt.hash(newPassword, salt)
			await User.findByIdAndUpdate(req.session.user._id, {
				password: hashedNewPassword,
			})
			res.status(200).json({})
		} else res.status(400).json({ error: "Invalid password" })
	} catch (error) {
		console.log(error)
		res.status(422)
		throw new Error(`Something went wrong`)
	}
})
const googleLogin = expressAsyncHandler(async (req, res) => {
	if (
		process?.env?.OAUTH_DISABLED !== true &&
		process?.env?.GOOGLE_OAUTH_DISABLED !== true
	) {
		try {
			const { credential } = req.body

			try {
				// Verify the credentialResponse using the Google OAuth client
				const ticket = await client.verifyIdToken({
					idToken: credential,
					audience: process.env.googleClientID,
				})

				const payload = ticket.getPayload()

				const fullname = payload.name
				const email = payload.email
				const avatar = payload.picture || ""

				//payload contains user information

				// const userId = payload["sub"]

				let user = await User.findOne({ email })

				if (!user) {
					user = await User.create({
						fullname,
						email,
						password: credential,
					})
				}

				const csrfSecret = await csrf.secret()
				const csrfToken = csrf.create(csrfSecret)

				await Token.create({
					user: user.id,
					clientSideCookie: csrfSecret,
				})

				req.session.user = { ...user._doc, csrfSecret, credential }

				// const { _id, fullname, username, avatar } = user

				res.status(200).json({
					_id: user._id,
					fullname,
					email,
					csrfToken,
					avatar,
				})

				// Perform user authentication and session management here
				// Example: Create a session and return a response indicating successful login
				// res.status(200).json({ message: "Google login successful", userId })
			} catch (error) {
				console.error("Google login error:", error)
				res.status(401).json({ message: "Google login failed" })
			}
		} catch (error) {
			console.log(error)
			res.status(422)
			if (error.message === "Invalid credentials")
				throw new Error(error.message)
			else throw new Error("Something went wrong")
		}
	} else {
		throw new Error("Service is disabled")
	}
})
const facebookLogin = expressAsyncHandler(async (req, res) => {
	if (
		process?.env?.OAUTH_DISABLED !== true &&
		process?.env?.FACEBOOK_OAUTH_DISABLED !== true
	) {
		const { accessToken, userID } = req.body
		try {
			// Make a GET request to Facebook's token debug endpoint
			const response = await axios.get(
				"https://graph.facebook.com/v12.0/me",
				{
					params: {
						access_token: accessToken,
						fields: "id, name, email", // Specify the fields you need to retrieve (e.g., 'id', 'name', 'email')
					},
				}
			)

			const userData = response.data

			// Check if the token is valid
			if (userData && userData?.id === userID) {
				const email = userData.email
				const fullname = userData.name

				let user = await User.findOne({ email })

				if (!user) {
					user = await User.create({
						fullname,
						email,
						password: accessToken,
					})
				}

				const csrfSecret = await csrf.secret()
				const csrfToken = csrf.create(csrfSecret)

				await Token.create({
					user: user.id,
					clientSideCookie: csrfSecret,
				})

				req.session.user = { ...user._doc, csrfSecret, accessToken }

				// const { _id, fullname, username, avatar } = user

				res.status(200).json({
					_id: user._id,
					fullname,
					email,
					csrfToken,
				})
			} else {
				// Token is invalid
				res.status(401).json({ message: "Facebook login failed" })
			}
		} catch (error) {
			console.error("Error verifying Facebook access token:", error)
			res.status(500).json({ error: "Internal server error" })
		}
	} else {
		throw new Error("Service is disabled")
	}
})
module.exports = {
	register,
	login,
	facebookLogin,
	googleLogin,
	logout,
	get,
	saveProfile,
	savePassword,
}

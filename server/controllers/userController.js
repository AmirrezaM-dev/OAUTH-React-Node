const expressAsyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
const csrf = require("csrf")()
const Token = require("../models/tokenModel")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.googleClientID)
const passport = require("passport")

const get = expressAsyncHandler(async (req, res) => {
	try {
		const { fullname, email, username, _id, avatar } = await User.findById(
			req.user.id
		).select("-password")
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
const googleGet = expressAsyncHandler(async (req, res) => {
	try {
		passport.authenticate("google", {
			successRedirect: "http://localhost:3000",
			failureRedirect: "/login/failed",
		})

		// res.status(200).json({})
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
		if (req.cookies.lt) {
			await Token.findOneAndDelete({ lt: req.cookies.lt, active: true })
			res.clearCookie("lt")
		}
		const email = req.body.email.toLowerCase(),
			password = req.body.password
		const user = await User.findOne({ email })
		if (user && (await bcrypt.compare(password, user.password))) {
			const token = generateToken(user._id)
			const csrfSecret = await csrf.secret()
			const csrfToken = csrf.create(csrfSecret)

			await Token.create({ user: user.id, lt: token, cs: csrfSecret })

			res.cookie("lt", token, {
				path: "/",
				sameSite: "none",
				maxAge: 99999999,
				httpOnly: true,
				secure: true,
			})

			const { _id, fullname, username, avatar } = user

			res.status(200).json({
				_id,
				fullname,
				email,
				username,
				csrfToken,
				avatar,
			})
		} else {
			res.status(400)
			throw new Error("Invalid credentials")
		}
	} catch (error) {
		res.status(422)
		if (error.message === "Invalid credentials")
			throw new Error(error.message)
		else throw new Error("Something went wrong")
	}
})
const googleLogin = expressAsyncHandler(async (req, res) => {
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

			const token = generateToken(user._id)
			const csrfSecret = await csrf.secret()
			const csrfToken = csrf.create(csrfSecret)

			await Token.create({
				user: user.id,
				lt: token,
				cs: csrfSecret,
			})

			res.cookie("lt", token, {
				path: "/",
				sameSite: "none",
				maxAge: 99999999,
				httpOnly: true,
				secure: true,
			})

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
})
const logout = expressAsyncHandler(async (req, res) => {
	if (req.cookies.lt) {
		await Token.findOneAndDelete({ lt: req.cookies.lt, active: true })
		res.clearCookie("lt")
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
const generateToken = (id) => {
	return jwt.sign({ id }, "abc123", {
		expiresIn: "30d",
	})
}
const saveProfile = expressAsyncHandler(async (req, res) => {
	try {
		if (!req.body?.email && !req.body?.username) {
			res.status(400)
			throw new Error("Please fill all fields")
		}
		const { fullname, username, email } = req.body
		const usernameOrEmailExist = await User.findOne({
			$or: [{ username }, { email }],
			_id: { $ne: req.user.id },
		})
		if (usernameOrEmailExist) {
			if (usernameOrEmailExist.username === username)
				res.status(400).json({ error: "Username already exists" })
			else if (usernameOrEmailExist.email === email)
				res.status(400).json({ error: "Email already exists" })
			else res.status(400).json({ error: "Something went wrong" })
		} else {
			const updatedUser = await User.findByIdAndUpdate(
				req.user.id,
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
		const user = await User.findById(req.user.id)
		if (user && (await bcrypt.compare(password, user.password))) {
			const salt = await bcrypt.genSalt(10)
			const hashedNewPassword = await bcrypt.hash(newPassword, salt)
			await User.findByIdAndUpdate(req.user.id, {
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

module.exports = {
	register,
	login,
	googleLogin,
	googleGet,
	logout,
	get,
	saveProfile,
	savePassword,
}

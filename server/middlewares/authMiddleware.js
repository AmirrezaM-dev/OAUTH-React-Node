const jwt = require("jsonwebtoken")
const expressAsyncHandler = require("express-async-handler")
const csrf = require("csrf")()
const User = require("../models/userModel")
const Token = require("../models/tokenModel")

const jsonWebTokenAndCsrfProtection = expressAsyncHandler(
	async (req, res, next) => {
		if (
			!req.cookies.lt ||
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer")
		) {
			res.status(401)
			throw new Error("Not authorized, no token")
		}
		try {
			const loginToken = req.cookies.lt
			const csrfToken = req.headers.authorization.split(" ")[1]
			const decoded = jwt.verify(loginToken, "abc123")
			req.user = await User.findById(decoded.id).select("-password")
			const csrfSecret = await Token.findOne({
				user: req.user.id,
				active: true,
				lt: loginToken,
			}).select("cs")
			if (csrf.verify(csrfSecret.cs, csrfToken)) {
				next()
			} else {
				res.status(401)
				throw new Error("Bad credentials")
			}
		} catch (error) {
			console.log(error)
			res.status(401)
			throw new Error("Not authorized")
		}
	}
)

module.exports = { jsonWebTokenAndCsrfProtection }

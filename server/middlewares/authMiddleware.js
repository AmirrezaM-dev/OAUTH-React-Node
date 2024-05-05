const expressAsyncHandler = require("express-async-handler")
const csrf = require("csrf")()
const Token = require("../models/tokenModel")

const jsonWebTokenAndCsrfProtection = expressAsyncHandler(
	async (req, res, next) => {
		if (
			!req.session.user ||
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer")
		) {
			res.status(401)
			throw new Error("Not authorized, no token")
		}
		try {
			const csrfToken = req.headers.authorization.split(" ")[1]
			const token = await Token.findOne({
				clientSideCookie: req.session.user.csrfSecret,
				active: true,
			}).select("clientSideCookie")
			const csrfSecret = token.clientSideCookie

			if (csrf.verify(csrfSecret, csrfToken)) {
				next()
			} else {
				res.status(401)
				throw new Error("Bad credentials")
			}
		} catch (error) {
			res.status(401)
			throw new Error("Not authorized")
		}
	}
)

module.exports = { jsonWebTokenAndCsrfProtection }

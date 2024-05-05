const net = require("net")
const server = net.createServer()
let port = 9000
server.once("error", (e) => {
	if (e.code === "EADDRINUSE") {
		port = port + 1
		server.listen(port)
	}
})
server.once("listening", function () {
	server.close()
})
server.listen(port)
server.once("close", function () {
	require("dotenv").config({ path: ".env" })
	require("./services/passport")
	const OAuth = require("oauth").OAuth
	const cors = require("cors")
	const express = require("express")
	const connectDB = require("./configs/db")
	const session = require("express-session")
	const passport = require("passport")
	const { errorHandler } = require("./middlewares/errorMiddleware")
	express.Router()
	const app = express()
	const origins = [process.env.FRONT_END_URL]
	const CORS = {
		origin: origins,
		credentials: true,
	}

	connectDB()
	app.use(cors(CORS))
	app.use(express.json())
	app.use(
		session({
			secret: process.env.SESSION_SECURE_KEY,
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: process.env.PRODUCTION ? true : false,
				maxAge: 24 * 60 * 60 * 1000 * 7,
			},
		})
	)
	app.use(passport.initialize())
	app.use(passport.session())

	app.use(express.urlencoded({ extended: false }))

	app.use("/api/users", require("./routes/userRoutes"))

	const oauth = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		process.env.TWITTER_CONSUMER_KEY,
		process.env.TWITTER_CONSUMER_SECRET,
		"1.0A", // OAuth version
		null,
		"HMAC-SHA1"
	)

	// app.get("/auth/twitter", (req, res) => {
	// 	oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
	// 		req.session.oauthToken = oauthToken
	// 		req.session.oauthTokenSecret = oauthTokenSecret
	// 		if (error) {
	// 			console.error("Error fetching OAuth request token:", error)
	// 			return res
	// 				.status(500)
	// 				.send("Failed to fetch OAuth request token")
	// 		}

	// 		// Redirect the user to the Twitter authorization URL
	// 		const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`
	// 		res.redirect(authUrl)
	// 	})
	// })
	// app.get("/:pin", (req, res) => {
	// 	console.log(req.session)
	// 	oauth.getOAuthAccessToken(
	// 		req.session.oauthToken, // The oauth_token obtained from the initial OAuth request
	// 		req.session.oauthTokenSecret, // The oauth_token_secret obtained from the initial OAuth request
	// 		req.params.pin, // The PIN code entered by the user
	// 		(error, accessToken, accessTokenSecret) => {
	// 			if (error) {
	// 				console.error(
	// 					"Error exchanging PIN code for access token:",
	// 					error
	// 				)
	// 				// Handle error accordingly
	// 			} else {
	// 				// Here you have the accessToken and accessTokenSecret
	// 				console.log("Access Token:", accessToken)
	// 				console.log("Access Token Secret:", accessTokenSecret)

	// 				// Example API request to verify credentials
	// 				oauth.get(
	// 					"https://api.twitter.com/1.1/account/verify_credentials.json",
	// 					accessToken,
	// 					accessTokenSecret,
	// 					(error, data) => {
	// 						if (error) {
	// 							console.error(
	// 								"Error verifying credentials:",
	// 								error
	// 							)
	// 						} else {
	// 							const user = JSON.parse(data)
	// 							console.log("User Info:", JSON.parse(data))
	// 							// Output the parsed user information if the request is successful
	// 						}
	// 					}
	// 				)

	// 				// Use these tokens to make authenticated API requests on behalf of the user
	// 			}
	// 		}
	// 	)
	// 	res.status(200).json({})
	// })

	app.get("/auth/twitter", passport.authenticate("twitter"))

	app.get(
		"/auth/twitter/callback",
		passport.authenticate("twitter", { failureRedirect: "/" }),
		(req, res) => {
			// Successful authentication, redirect or respond with data
			res.redirect("/profile")
		}
	)

	app.get("/profile", (req, res) => {
		// Access user profile from req.user
		res.json(req.user)
	})

	app.use(errorHandler)

	app.listen(port, () => {
		console.log(`Server started on port ${port}`)
	})
})

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
	const cors = require("cors")
	const express = require("express")
	const passport = require("passport")
	const cookieParser = require("cookie-parser")
	const cookieSession = require("cookie-session")
	require("dotenv").config({ path: ".env" })
	require("./services/passport")
	express.Router()
	const { errorHandler } = require("./middlewares/errorMiddleware")
	const connectDB = require("./configs/db")
	const app = express()
	const origins = [process.env.FRONT_END_URL]
	const CORS = {
		origin: origins,
		credentials: true,
	}
	app.use(cors(CORS))

	connectDB()

	app.use(cookieParser())

	app.use(
		cookieSession({
			name: "session",
			maxAge: 30 * 24 * 60 * 60 * 1000,
			keys: [process.env.cookieKey],
		})
	)

	app.use(passport.initialize())
	app.use(passport.session())

	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))

	app.use("/api/users", require("./routes/userRoutes"))

	app.use(errorHandler)

	app.listen(port, () => {
		console.log(`Server started on port ${port}`)
	})
})

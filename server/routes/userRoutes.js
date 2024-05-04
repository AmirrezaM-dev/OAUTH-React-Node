const express = require("express")
// const nodemailer = require("nodemailer")
const router = express.Router()
const {
	register,
	login,
	googleLogin,
	get,
	logout,
} = require("../controllers/userController")
const {
	jsonWebTokenAndCsrfProtection,
} = require("../middlewares/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post("/googleLogin", googleLogin)
router.get("/logout", [jsonWebTokenAndCsrfProtection], logout)

// router.post("/resetPassword", (req, res) => {
// 	// Destructure email properties from the request body
// 	const to = "vpn.re.123@gmail.com"
// 	const subject = "test"
// 	const text = "test"

// 	console.log(req.body)

// 	// Create a transporter object using SMTP transport
// 	let transporter = nodemailer.createTransport({
// 		host: "smtp.example.com",
// 		port: 587,
// 		secure: false, // true for 465, false for other ports
// 		auth: {
// 			user: "your-email@example.com", // Your email address
// 			pass: "your-password", // Your email password
// 		},
// 	})

// 	// Setup email data with unicode symbols
// 	let mailOptions = {
// 		from: '"Sender Name" <sender@example.com>', // sender address
// 		to: to, // recipient address
// 		subject: subject, // Subject line
// 		text: text, // plain text body
// 	}

// 	// Send mail with defined transport object
// 	transporter.sendMail(mailOptions, (error, info) => {
// 		if (error) {
// 			console.log(error)
// 			res.status(500).send("Error sending email")
// 		} else {
// 			console.log("Message sent: %s", info.messageId)
// 			res.send("Email sent successfully")
// 		}
// 	})
// })

router.get("/get", [jsonWebTokenAndCsrfProtection], get)

module.exports = router

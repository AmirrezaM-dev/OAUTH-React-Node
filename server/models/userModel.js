const mongoose = require("mongoose")
const userSchema = mongoose.Schema(
	{
		fullname: {
			type: String,
			required: [true, "Please fill the fullname field"],
		},
		avatar: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "Please fill the email field"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please fill the password field"],
		},
	},
	{ timestamps: true }
)
userSchema.index({ fullname: 1, username: 1 })
module.exports = mongoose.model("User", userSchema)

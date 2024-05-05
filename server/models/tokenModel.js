const mongoose = require("mongoose")
const tokenSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		clientSideCookie: {
			type: String,
			required: [true, "Please fill the field"],
			unique: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)
module.exports = mongoose.model("Token", tokenSchema)

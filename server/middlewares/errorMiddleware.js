const errorHandler = (err, req, res, next) => {
	if (err) console.log(`error: ${err}`)
	const statusCode = res.statusCode ? res.statusCode : 500
	if (res) {
		res.status(statusCode)
		res.json({
			message: err.message,
		})
	}
}
module.exports = { errorHandler }

const GoogleStrategy = require("passport-google-oauth20").Strategy
const passport = require("passport")

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.googleClientID,
			clientSecret: process.env.googleClientSecret,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},

		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile)
		}
	)
)

passport.serializeUser(async (req, user, done) => {
	console.log(user)
	// called only when you sign in
	done(null, user)
})

// passport.deserializeUser(async (req, user, done) => {
passport.deserializeUser(async (req, user, done) => {
	//called every time page is refreshed
	done(null, user)
})

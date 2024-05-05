const GoogleStrategy = require("passport-google-oauth20").Strategy
const passport = require("passport")
const TwitterStrategy = require("passport-twitter").Strategy

passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: "dummy",
		},
		(token, tokenSecret, profile, done) => {
			// Handle user profile data
			return done(null, profile)
		}
	)
)

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

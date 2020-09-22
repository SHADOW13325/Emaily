const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => {
			done(null, user);
			return 1;
		})
		.catch((error) => {
			console.log(`Error Occured ${error}`);
		});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
			proxy: true
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleID: profile.id })
				.then((existingUser) => {
					if (existingUser) {
						console.log("User already exists");
						done(null, existingUser);
					} else {
						new User({ googleID: profile.id })
							.save()
							.then((user) => {
								console.log("User Created");
								done(null, user);
								return 1;
							})
							.catch((error) => {
								console.log(
									`User can't be created due to internal error ${error}`
								);
							});
					}
					return 1;
				})
				.catch((error) => {
					console.log(
						`User can't be created due to internal error ${error}`
					);
				});
		}
	)
);

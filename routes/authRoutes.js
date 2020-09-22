const passport = require("passport");

module.exports = (app) => {

	// Kicks the user in the oauth flow - 2 arguments
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["profile", "email"],
		})
	);

	// app.get("/", (req, res) => {
	// 	res.send({ Saumitra: "Genius" });
	// });

	// Exchange the return code for the actual user profile
	app.get("/auth/google/callback", passport.authenticate('google'), (req, res) => {
		res.redirect('/surveys');
	});

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get('/api/current_user', (req, res) => {
		// res.send(req.session);
		res.send(req.user);
	});
};

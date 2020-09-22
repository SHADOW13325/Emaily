const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
	app.post("/api/stripe", requireLogin, async (req, res) => {
		
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 500,
			currency: "usd",
			description: "$5 for 5 credits",
			payment_method_types: ["card"],
			metadata: {
				order_id: req.body.id,
			},
			shipping: {
				address: {
					line1: "510 Townsend St",
					postal_code: "98140",
					city: "San Francisco",
					state: "CA",
					country: "US",
				},
				name: "Jenny Rosen",
			},
		});

		req.user.credits += 5;
		const user = await req.user.save();
		res.send(user);
	});
};

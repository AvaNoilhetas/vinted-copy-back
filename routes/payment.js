const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
require("dotenv").config();

router.post("/payment", async (req, res) => {
  try {
    const stripeToken = req.fields.stripeToken;
    const { amount, description } = req.fields;

    const response = await stripe.charges.create({
      amount: amount,
      currency: "eur",
      description: description,
      source: stripeToken
    });

    console.log(response.status);
    // TODO
    // Save the transaction BDD MongoDB
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;

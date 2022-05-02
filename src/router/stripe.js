const express = require("express")
const router = new express.Router()
// login to stripe and then get an api key
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else res.json(stripeRes)
    }
  )
})

module.exports = router

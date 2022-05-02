const express = require("express")
const router = new express.Router()
const Cart = require("../models/Cart")

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken")

// create

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedCart = await newCart.save()
    res.status(200).json(savedCart)
  } catch (e) {
    res.status(500).json(e)
  }
})

//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )

    res.send(updatedCart)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json("Cart has been deleted...")
  } catch (e) {
    res.status(500).json(e)
  }
})

// Get User Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
    res.status(200).json(cart)
  } catch (e) {
    res.status(500).json(e)
  }
})

//get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router

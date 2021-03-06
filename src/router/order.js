const express = require("express")
const router = new express.Router()
const Order = require("../models/Order")

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken")

// create

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)
  } catch (e) {
    res.status(500).json(e)
  }
})

//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
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

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json("Order has been deleted...")
  } catch (e) {
    res.status(500).json(e)
  }
})

// Get Product
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    res.status(200).json(orders)
  } catch (e) {
    res.status(500).json(e)
  }
})

//get All
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (e) {
    res.status(500).json(e)
  }
})

// get monthlyIncome
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ])

    res.json(income)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router

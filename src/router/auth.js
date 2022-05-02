const express = require("express")
const router = new express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// install cryptojs
// const CryptoJS = require('crypto-js')

const User = require("../models/User")

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 8),
    // password: await CyptoJs.AES.encrypt(
    //   req.body.password,
    //   process.env.PASS_SEC
    // ).toString(),
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) return res.status(401).json("wrong credentials!")

    const isMatch = bcrypt.compare(password, user.password)

    // const hashedPassword = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SEC
    // )
    // const password = hashedPassword.toString(CryptoJS.enc.Utf8)

    if (!isMatch) return res.status(401).json("wrong credentials!")

    // another way hide the password
    // const { password, ...others } = user._doc

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "40d" }
    )

    const usr = user.toJSON()
    res.status(200).send({ ...usr, accessToken })
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router

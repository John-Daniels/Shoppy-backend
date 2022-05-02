require("./db/mongoose")
const express = require("express")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

//init dotenv
dotenv.config()
// create a .env file in the root of this project
// then put your own keys
// uncomment this and paste it into the file
// MONGODBURI=yourMongodbUri
// PASS_SEC=yourPasswordSec
// JWT_SEC=yourJwtSec
// STRIPE_KEY=Yourstripekey
// all these are required by the project.

const authRoute = require("./router/auth")
const userRoute = require("./router/user")
const productRoute = require("./router/product")
const cartRoute = require("./router/cart")
const orderRoute = require("./router/order")
const stripeRoute = require("./router/stripe")

const port = process.env.PORT || 6000

const app = express()
app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/order", orderRoute)
app.use("/api/checkout", stripeRoute)

app.listen(port, () => console.log(`Server is up on port ${port}`))

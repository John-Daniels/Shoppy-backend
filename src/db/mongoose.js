const mongoose = require("mongoose")

const localUri = "mongodb://127.0.0.1:27017/shopApi"
const Uri = process.env.MONGODBURI || localUri

const connect = async () => {
  try {
    await mongoose.connect(Uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected Succefully................")
  } catch (error) {
    console.log(error)
  }
}

connect()

module.exports = mongoose

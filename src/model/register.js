const mongoose = require("mongoose")
const regusterdata = mongoose.Schema({
    name:String,
    phone:String,
    age:String,
    email:String,
    password:String
})

module.exports = mongoose.model("info" , regusterdata)
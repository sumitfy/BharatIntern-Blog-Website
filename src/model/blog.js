const mongoose= require("mongoose");
const blogschema = mongoose.Schema({
    name:String,
    heading:String,
    blog:String
}
)

module.exports = mongoose.model('blogs' , blogschema)
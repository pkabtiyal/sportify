const mongoose = require('mongoose')
const Schema = mongoose.Schema
// var ObjectIdSchema = Schema.ObjectId;
// var ObjectId = mongoose.Types.ObjectId;

const merchandiseSchema = new Schema({
    product_id: String,
    product_name: String,
    product_price: Number,
    product_description: String,
    product_image: String,
    // product_id: {type:ObjectIdSchema, default: function () { return new ObjectId()} }
    }, 
)

const Merchandise =  mongoose.model('merchandise',merchandiseSchema)
module.exports = Merchandise;
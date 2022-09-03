const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    id : String,
    timestamp : Date,
    message : String,
    customers : Array
})

const BroadcastDB = mongoose.model('broadcast', schema);

module.exports = BroadcastDB;
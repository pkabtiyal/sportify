const mongoose = require('mongoose');

// membership schema - used to store details of membership purchase
let schema = new mongoose.Schema({
    id : String,
    user_id : String,
    total_cost : Number,
    plan_name : String,
    start_date : Date,
    end_date : Date,
    status : String
})

const MembershipDB = mongoose.model('memberships', schema);

module.exports = MembershipDB;
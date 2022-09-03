const mongoose = require('mongoose');

// membershipBilling schema - used to store details of billing details of a user
let schema = new mongoose.Schema({
    id : String,
    first_name : String,
    last_name : String,
    address : String,
    city : String,
    state : String,
    zip_code : String,
    country : String
})

const MembershipBillingDB = mongoose.model('membership_billing', schema);

module.exports = MembershipBillingDB;
//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * This is general schema for facilities
 */
const facilitiesSchema = new Schema({
    id: String,
    name: String,
    location: String,
    description: String,
    category: String,
    image: String
});

const Facilities = new model('Facilities', facilitiesSchema);
module.exports = Facilities;
//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * This is general schema for events
 */
const eventsSchema = new Schema({
    id: String,
    name: String,
    date: {type: Date},
    location: String,
    description: String,
    maxCapacity: Number,
    availableCapacity: Number,
    category: String,
    image: String
});

const Events = new model('events', eventsSchema);
module.exports = Events;
//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * This is general schema for events
 */
const eventBookingsSchema = new Schema({
    id: String,
    eventId: String,
    userId: String,
    bookingDate: {type: Date},
    bookedTickets: Number,
    status: 'Active'| 'Cancelled',
    name: String,
    phone: String
});

const EventBookings = new model('event_bookings', eventBookingsSchema);
module.exports = EventBookings;
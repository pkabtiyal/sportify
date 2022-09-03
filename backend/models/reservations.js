//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

/**
 * Schema for reservations collection in mongodb
 */
const reservationSchema = new Schema({
    id: String,
    facility_id: String,
    from: Date,
    to: Date,
    booked_date: Date,
    reserved_by: String,
    reserved_for: String,
    status: "Active" | "Cancelled"
});

const Reservations = new model('Reservations', reservationSchema);
module.exports = Reservations;
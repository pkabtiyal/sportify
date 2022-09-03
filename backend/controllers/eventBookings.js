//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const EventBookingModel = require('../models/eventBookings');
const eventController = require('../controllers/events');

const getUserEventBookings = async (userId) => {
    const userBookings = await EventBookingModel.find({userId: userId});
    const eventIds = userBookings?.map(userBooking => userBooking.eventId);
    const events = await eventController.getEventsByIds(eventIds);
    return mergeEventsAndBookingModels(events, userBookings);
}

const getRawBooking = async (bookingId) => {
    return await EventBookingModel.findOne({id: bookingId});
}
const getSingleBooking = async (bookingId) => {
    const userBooking = await EventBookingModel.findOne({id: bookingId});
    const event = await eventController.getSingleEvent(userBooking?.eventId);
    if (event == null || userBooking == null) {
        return userBooking;
    }
    return {
        bookingId: userBooking.id,
        eventName: event.name,
        eventDate: event.date,
        bookingDate: userBooking.bookingDate,
        capacity: event.maxCapacity,
        bookedTickets: userBooking.bookedTickets,
        eventDescription: event.description,
        image: event.image,
        status: userBooking.status,
    }
}

function mergeEventsAndBookingModels(events, userBooking) {
    if (events?.length == 0 || userBooking?.length == 0) {
        return userBooking;
    }
    return userBooking.map(userBooking => {
        const facilityId = userBooking.eventId;
        const event = events.find(facility => facility.id === facilityId);
        return {
            bookingId: userBooking.id,
            image: event.image,
            eventName: event.name,
            eventDate: event.date,
            bookingStatus: userBooking.status,
            ticketsBooked: userBooking.bookedTickets,
        }
    });
}

const cancelBooking = async (bookingId, userId) => {
    return await EventBookingModel.findOneAndUpdate({id: bookingId}, {status: 'Cancelled'}, {new: true});
}

module.exports = { getUserEventBookings, getSingleBooking, getRawBooking, cancelBooking };
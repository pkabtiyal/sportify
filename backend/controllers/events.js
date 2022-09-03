//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const Events = require('../models/events');

const getEventsWithinDateRange = async (from, to) => {
    let query = {
        $gte: new Date()
    };
    if (from) {
        query.$gte = from;
    }
    if (to) {
        query.$lt = to;
    }
    const events = await Events.find({
        date: query
    });
    return events;
}
const createEvent = async (eventDetails) => {
    const event = new Events(eventDetails);
    return await event.save();
}

const getSingleEvent = async (id) => {
    return await Events.findOne({id: id});
}

const updateEventAvailableSeats = async (eventDetails, ticketsBooked) => {
    const filter = {id: eventDetails.id};
    const updatedAvailableSeats = eventDetails.availableCapacity - ticketsBooked;
    const update = {availableCapacity: updatedAvailableSeats};
    return await Events.findOneAndUpdate(filter, update, {new: true});
}

const increaseEventAvailableSeats = async (eventId, cancelledTickets) => {
    const filter = {id: eventId};
    const event = await Events.findOne(filter);
    const updatedAvailableSeats = event.availableCapacity + cancelledTickets;
    const updated = {availableCapacity: updatedAvailableSeats};
    return await Events.findOneAndUpdate(filter, updated, {new: true});
}

const getEventsByIds = async (ids) => {
    return await Events.find({id: {$in: ids}});
}

module.exports = { getEventsWithinDateRange, getSingleEvent, updateEventAvailableSeats, getEventsByIds, createEvent, increaseEventAvailableSeats };
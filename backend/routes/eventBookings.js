//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const express = require('express');
const {v4: uuidv4} = require('uuid');
const authentication = require('../middleware/authentication');
const eventController = require('../controllers/events');
const EventBookingModel = require('../models/eventBookings');
const eventBookingController = require('../controllers/eventBookings');
const router = express.Router();

router.post('/book', authentication.verifyRequest, async(req, res) => {
    const eventBookingDetails = req.body;
    if (!eventBookingDetails?.eventId) {
        return res.status(400).json({
            message: "Event is required for booking",
            success: false
        })
    }
    const event = await eventController.getSingleEvent(eventBookingDetails.eventId);
    if(!event) {
        return res.status(404).json({
            message: "Event not found",
            success: false
        })
    }
    if (event.date < new Date()) {
        return res.status(400).json({
            message: "Can't book tickets for past events",
            success: false,
        })
    }
    if (event.availableCapacity < eventBookingDetails?.bookedTickets) {
        return res.status(400).json({
            message: "Not enough tickets available",
            success: false,
        });
    }
    const booking = {
        ...eventBookingDetails,
        id: uuidv4(),
        status: 'Active',
        bookingDate: new Date()
    }
    const bookingModel = new EventBookingModel(booking);
    await bookingModel.save();
    await eventController.updateEventAvailableSeats(event, eventBookingDetails.bookedTickets);
    return res.status(201).json({
        data: bookingModel,
        success: true,
    })
});

router.get('/my-bookings/:userId', authentication.verifyRequest, async (req, res) => {
    const userId = req.params.userId;
    try {
        const userBookings = await eventBookingController.getUserEventBookings(userId);
        return res.status(200).json({
            data: userBookings,
            success: true
        });
    }
    catch (err) {
        console.log(`Exception occured while fetch event booking for user: ${userId} `, err);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
});


router.get('/my-single-booking/:bookingId', authentication.verifyRequest, async (req, res) => {
    const bookingId = req.params.bookingId;
    const booking = await eventBookingController.getSingleBooking(bookingId);
    return res.status(200).send({
        data: booking,
        success: true,
    });
});

router.put('/cancel-event/:bookingId/:userId', authentication.verifyRequest, async (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.params.userId;
    const booking = await eventBookingController.getRawBooking(bookingId);
    if (!booking) {
        return res.status(404).send({
            message: "Couldn't find the booking",
            success: false,
        });
    }
    if (booking.userId !== userId) {
        return res.status(401).send({
            message: 'You are not authorized to cancel this booking',
            success: false,
        })
    }
    if (booking.status === 'Cancelled') {
        return res.status(400).send({
            message: 'Booking was already cancelled',
            success: false,
        });
    }
    const updatedBooking = await eventBookingController.cancelBooking(bookingId, userId);
    await eventController.increaseEventAvailableSeats(booking.eventId, booking.bookedTickets);
    return res.status(200).send({
        data: updatedBooking,
        success: true,
    });
});

module.exports = router;
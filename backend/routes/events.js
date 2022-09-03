//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const express = require('express');
const {v4: uuidv4} = require('uuid');
const authentication = require('../middleware/authentication');
const eventController = require('../controllers/events');
const router = express.Router();

router.post('/create', async(req, res) => {
    const eventDetails = req.body;
    if (eventDetails.date < new Date()) {
        return res.status(400).json({
            message: "Can't create events in past",
            success: false,
        });
    }
    try {
        const eventData = {
            ...eventDetails,
            id: uuidv4(),
        }
        await eventController.createEvent(eventData);
        return res.status(201).json({
            message: 'successfully created the event',
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
})

router.get("/fetch", async(req, res) => {
    const fromDate = req?.query?.from;
    const toDate = req?.query?.to;
    if (fromDate && toDate && fromDate > toDate) {
        return res.status(400).json({
            message: "From can't be greater than to",
            success: false,
        });
    }
    if (toDate && new Date(toDate) < new Date()) {
        return res.status(400).json({
            message: "Can't filter past events",
            success: false,
        });
    }
    try {
        const events = await eventController.getEventsWithinDateRange(fromDate, toDate);
        return res.status(200).json({
            data: events,
            success: true
        });
    }
    catch (err) {
        console.log('Exception occured while fetching event', err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});

router.get("/single-event/:eventId", authentication.verifyRequest, async (req, res) => {
    const id = req.params.eventId;
    if (!id) {
        return res.status(400).send({
            message: "Id is required!",
            success: false,
        });
    }

    try {
        const event = await eventController.getSingleEvent(id);
        if (!event) {
            return res.status(404).send({
                message: "Event not found!",
                success: false
            });
        }
        return res.status(200).send({
            data: event,
            success: true
        });
    }
    catch (err) {
        console.log(`Exception occured while fetching details of the event : ${id}`, err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})

module.exports = router;
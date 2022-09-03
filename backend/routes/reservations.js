//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Reservations = require('../models/reservations');
const ReservationController = require('../controllers/reservations');
const router = express.Router();

/**
 * Book reservation API.
 */
router.post('/', async (req, res, next) => {
    let reservationDetails = req.body;
    for (const prop in reservationDetails) {
        if (!reservationDetails[prop]) {
            return res.status(400).send({
                message: `${prop} is required for reservation.`,
                success: false,
            });
        }
        if (prop === 'from' && new Date(reservationDetails[prop]) < new Date()) {
            return res.status(400).send({
                message: `Date must not be in past`,
                success: false,
            });
        }
    }
    next();
}, async (req, res, next) => {
    // this function is used to check if the selected
    // timeslot has already been booked or not.
    let reservationDetails = req.body;
    const bookedReservations =
        await ReservationController.getReservationByFacilityIdAndDate(reservationDetails.facility_id, reservationDetails.from);
    // check time slot is already booked
    const isSlotClashed = bookedReservations?.find(reservation => {
        return (equalTimes(reservation.from, new Date(reservationDetails.from))
            && equalTimes(reservation.to, new Date(reservationDetails.to)));
    }) !== undefined;
    if (isSlotClashed) {
        return res.status(409).json({
            message: 'The selected timeslot is already booked',
            success: false,
        });
    }
    next();
}, async (req, res) => {
    // adding reservation to the database.
    let reservationDetails = req.body;
    reservationDetails.id = uuidv4();
    reservationDetails.status = 'Active';
    try {
        const reservationDoc = new Reservations(reservationDetails);
        await reservationDoc.save();
        return res.status(200).json({
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

function equalTimes(date1, date2) {
    console.log(`${date1.toTimeString()}, ${date2.toTimeString()}`);
    return date1.toTimeString() === date2.toTimeString();
}

/**
 * This API cancels the reservation made by the user.
 */
router.put('/cancel-reservation/:reservationId', async (req, res, next) => {
    const reservationId = req.params.reservationId;
    const reservation = await ReservationController.getRawReservation(reservationId);
    if (!reservation) {
        return res.status(404).json({
            message: "Reservation not found!",
            success: false,
        });
    }
    if (reservation.status === 'Cancelled') {
        return res.status(200).json({
            message: "Reservation was already cancelled",
            success: true,
        })
    }
    if (reservation.from <= new Date()) {
        return res.status(400).json({
            message: "Past reservations can't be cancelled",
            success: false,
        })
    }
    req.body = reservation;
    next();
}, async (req, res, next) => {
    const updatedDoc = await Reservations.findOneAndUpdate({ id: req.params.reservationId }, { status: 'Cancelled' }, { new: true });
    return res.status(200).json({
        data: updatedDoc,
        success: true
    })
})

/**
 * This API fetches the details of all
 * the reservations made by the user.
 */
router.get('/my-reservations/:userId', async (req, res) => {
    const userId = req.params.userId;
    const reservations = await ReservationController.getAllReservations(userId);
    return res.status(200).json({
        data: reservations,
        success: true
    });
});

/**
 * This API fetches the details of single reservation
 * along with the facility details to show them in reservation
 * details page.
 */
router.get('/my-single-reservation/:reservationId', async (req, res) => {
    const reservationId = req.params.reservationId;
    const reservationRes = await ReservationController.getSingleReservation(reservationId);
    if (!reservationRes) {
        return res.status(404).json({
            message: "Reservation not found!",
            success: false
        });
    }
    return res.status(200).json({
        data: reservationRes,
        success: true
    });
});

module.exports = router;
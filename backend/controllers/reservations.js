//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const FacilitiesController = require('../controllers/facilities');
const Reservations = require('../models/reservations');

/**
 * This function is used to get all the reservation details
 * for the given userId.
 * @param {String} userId 
 * @returns 
 */
const getAllReservations = async (userId) => {
    const reservations = await Reservations.find({ reserved_by: userId });
    if (!reservations || reservations.length == 0) {
        return new Promise((resolve) => {
            resolve(reservations);
        });
    }
    const ids = reservations.map(reservation => reservation.facility_id);
    const facilitiesData = await FacilitiesController.getFacilitiesData(ids);
    const response = mergeFacilitiesDataWithReservations(facilitiesData, reservations);
    return new Promise(resolve => {
        resolve(response);
    });
}

/**
 * Get booked time slots with start and end time information.
 * This functionality is used to show only available time slots so that 
 * users can't book same time slot more than once.
 * @param {Number} facilityId 
 * @param {Date} date 
 * @returns List
 */
const getReservationByFacilityIdAndDate = async (facilityId, date) => {
    const reservations = await Reservations.find({facility_id: facilityId});
    const bookedSlotsForDate = reservations?.filter(reservation => {
        return equalDates(reservation.from, new Date(date)) && equalDates(reservation.to, new Date(date)) && (reservation.status === 'Active');
    });
    return bookedSlotsForDate?.map(bookedSlot => {
        return {
            from: bookedSlot.from,
            to: bookedSlot.to,
        };
    })
}

function equalDates(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

const getRawReservation = async (reservationId) => {
    const reservation = await Reservations.findOne({id: reservationId});
    return new Promise((resolve) => {
        resolve(reservation);
    });
}

/**
 * This helper function is used to merge 
 * reservation details with facilities so that facility details
 * are visible along with reservations in My Reservations page.
 * @param {List} facilitiesData 
 * @param {List} reservations 
 * @returns 
 */
function mergeFacilitiesDataWithReservations(facilitiesData, reservations) {
    if (reservations?.length == 0 || facilitiesData?.length == 0) {
        return reservations;
    }
    return reservations.map(reservation => {
        const facilityId = reservation.facility_id;
        const facility = facilitiesData.find(facility => facility.id === facilityId);
        return {
            id: reservation.id,
            reservationFrom: reservation.from,
            reservationTo: reservation.to,
            reservationDate: reservation.booked_date,
            reservedBy: 'John Doe',
            reservedFor: reservation.reserved_for,
            reservationStatus: reservation.status,
            equipmentImg: facility.equipmentImg,
            equipmentName: facility.equipmentName
        }
    });
}

/**
 * This function is used to get reservation details
 * of the given reservationId along with its facility
 * details. This data is used in displaying details in the 
 * reservation details page.
 * @param {String} reservationId 
 * @returns 
 */
const getSingleReservation = async (reservationId) => {
    const reservationRes = await Reservations.findOne({ id: reservationId });
    if (!reservationRes) {
        return new Promise((resolve) => {
            resolve(reservationRes);
        })
    }

    const facilityDetails = await FacilitiesController.getSingleFacilityData(reservationRes.facility_id);
    if (!facilityDetails) {
        return new Promise((resolve) => {
            resolve(reservationRes);
        })
    }

    const reservationWrap = {
        id: reservationId,
        reservationFrom: reservationRes.from,
        reservationTo: reservationRes.to,
        reservationDate: reservationRes.booked_date,
        reservedBy: 'John Doe',
        reservedFor: reservationRes.reserved_for,
        reservationStatus: reservationRes.status,
        equipmentName: facilityDetails.equipmentName,
        equipmentLoc: facilityDetails.equipmentLoc,
        equipmentImg: facilityDetails.equipmentImg,
        equipmentCategory: facilityDetails.equipmentCategory
    }


    return new Promise((resolve) => {
        resolve(reservationWrap);
    });
}

module.exports = { getAllReservations, getSingleReservation, getRawReservation, getReservationByFacilityIdAndDate };
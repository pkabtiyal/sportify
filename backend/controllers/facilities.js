//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const Facilities = require("../models/facilities");

/**
 * Get data for a single facility which is used to display information in 
 * reservation details page for a single reservation.
 * @param {Number} facilityId 
 * @returns 
 */
const getSingleFacilityData = async (facilityId) => {
    const facilityData = await Facilities.findOne({ id: facilityId });
    return new Promise((resolve) => {
        if (!facilityData) {
            resolve(facilityData);
        }
        else {
            resolve({
                equipmentName: facilityData.name,
                equipmentLoc: facilityData.location,
                equipmentCategory: facilityData.category,
                equipmentImg: facilityData.image
            });
        }
    });
}

/**
 * Get images for the facilities which can be viewied in the my reservations page.
 * @param {List} facilityIds 
 * @returns 
 */
const getFacilitiesData = async (facilityIds) => {
    const faciltiesData = await Facilities.find({
        id: facilityIds
    });
    return new Promise((resolve) => {
        if (faciltiesData.length == 0) {
            resolve(faciltiesData);
        }
        else {
            resolve(faciltiesData.map((facility) => {
                return {
                    id: facility.id,
                    equipmentImg: facility.image,
                    equipmentName: facility.name,
                    equipmentLoc: facility.location,
                    equipmentCategory: facility.category,
                }
            }));
        }
    })
}

module.exports = { getSingleFacilityData, getFacilitiesData };
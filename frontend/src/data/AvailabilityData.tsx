/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { AvailabilitySlots } from "./AvailaibilitySlots";
import { Timeslot } from "./BookedSlot";

const availabilitySlots: AvailabilitySlots[] = [
    {
        id: 1,
        displayValue: '6:00 - 6:30 AM',
        from: new Date(2022, 6, 16, 6, 0, 0),
        to: new Date(2022, 6, 16, 6, 30, 0),
    },
    {
        id: 2,
        displayValue: '6:30 - 7:00 AM',
        from: new Date(2022, 6, 16, 6, 30, 0),
        to: new Date(2022, 6, 16, 7, 0, 0),
    },
    {
        id: 3,
        displayValue: '7:00 - 7:30 AM',
        from: new Date(2022, 6, 16, 7, 0, 0),
        to: new Date(2022, 6, 16, 7, 30, 0),
    },
    {
        id: 4,
        displayValue: '7:30 - 8:00 AM',
        from: new Date(2022, 6, 16, 7, 30, 0),
        to: new Date(2022, 6, 16, 8, 0, 0),
    },
    {
        id: 5,
        displayValue: '8:00 - 8:30 AM',
        from: new Date(2022, 6, 16, 8, 0, 0),
        to: new Date(2022, 6, 16, 8, 30, 0),
    },
    {
        id: 6,
        displayValue: '8:30 - 9:00 AM',
        from: new Date(2022, 6, 16, 8, 30, 0),
        to: new Date(2022, 6, 16, 9, 0, 0),
    },
    {
        id: 7,
        displayValue: '9:00 - 9:30 AM',
        from: new Date(2022, 6, 16, 9, 0, 0),
        to: new Date(2022, 6, 16, 9, 30, 0),
    },
    {
        id: 8,
        displayValue: '9:30 - 10:00 AM',
        from: new Date(2022, 6, 16, 9, 30, 0),
        to: new Date(2022, 6, 16, 10, 0, 0),
    },
    {
        id: 9,
        displayValue: '10:00 - 10:30 AM',
        from: new Date(2022, 6, 16, 10, 0, 0),
        to: new Date(2022, 6, 16, 10, 30, 0),
    },
    {
        id: 10,
        displayValue: '10:30 - 11:00 AM',
        from: new Date(2022, 6, 16, 10, 30, 0),
        to: new Date(2022, 6, 16, 11, 0, 0),
    },
    {
        id: 11,
        displayValue: '11:00 - 11:30 AM',
        from: new Date(2022, 6, 16, 11, 0, 0),
        to: new Date(2022, 6, 16, 11, 30, 0),
    },
    {
        id: 12,
        displayValue: '11:30 - 12:00 PM',
        from: new Date(2022, 6, 16, 11, 30, 0),
        to: new Date(2022, 6, 16, 12, 0, 0),
    },
    {
        id: 13,
        displayValue: '12:00 - 12:30 PM',
        from: new Date(2022, 6, 16, 12, 0, 0),
        to: new Date(2022, 6, 16, 12, 30, 0),
    },
    {
        id: 14,
        displayValue: '1:30 - 2:00 PM',
        from: new Date(2022, 6, 16, 13, 30, 0),
        to: new Date(2022, 6, 16, 14, 0, 0),
    },
    {
        id: 15,
        displayValue: '2:00 - 2:30 PM',
        from: new Date(2022, 6, 16, 14, 0, 0),
        to: new Date(2022, 6, 16, 14, 30, 0),
    },
    {
        id: 16,
        displayValue: '2:30 - 3:00 PM',
        from: new Date(2022, 6, 16, 14, 30, 0),
        to: new Date(2022, 6, 16, 15, 0, 0),
    },
    {
        id: 17,
        displayValue: '3:00 - 3:30 PM',
        from: new Date(2022, 6, 16, 15, 0, 0),
        to: new Date(2022, 6, 16, 15, 30, 0),
    }
]

const getAvailabilitySlot = (slotId: Number) => {
    return availabilitySlots.find(slot => slot.id === slotId);
}

const getFromDate = (slotId: Number, date: Date|undefined|null) => {
    const slot = getAvailabilitySlot(slotId);
    const slotTime = slot?.from;
    let updatedDate: Date = (!date) ? new Date() : new Date(date);
    updatedDate.setHours(slotTime?.getHours() || 6);
    updatedDate.setMinutes(slotTime?.getMinutes() || 0);
    updatedDate.setSeconds(0);
    return updatedDate;
}

const getToDate = (slotId: Number, date: Date|undefined|null) => {
    const slot = getAvailabilitySlot(slotId);
    const slotTime = slot?.to;
    let updatedDate: Date = (!date) ? new Date() : new Date(date);
    updatedDate.setHours(slotTime?.getHours() || 6);
    updatedDate.setMinutes(slotTime?.getMinutes() || 0);
    updatedDate.setSeconds(0);
    return updatedDate;
}

const getRemainingAvailableSlots = (bookedSlots: Timeslot[]): AvailabilitySlots[] => {
    if (!bookedSlots?.length) {
        return availabilitySlots;
    }
    return availabilitySlots.filter(availabilitySlot => {
        return (!bookedSlots.find(bookedSlot => {
            return (new Date(bookedSlot.from).toTimeString() === new Date(availabilitySlot.from).toTimeString()) && 
                (new Date(bookedSlot.to).toTimeString() === new Date(availabilitySlot.to).toTimeString());
        }))
    });
}

export {availabilitySlots, getFromDate, getToDate, getRemainingAvailableSlots};
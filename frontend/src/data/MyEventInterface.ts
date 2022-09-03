/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
export interface MyEventInterface {
    bookingId: string,
    eventName: string,
    eventDate: Date,
    bookingDate: Date,
    capacity: number,
    bookedTickets: number,
    eventDescription: string,
    image: string,
    status?: 'Active' | 'Cancelled',
}
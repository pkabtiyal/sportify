/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
export interface EventInterface {
    id: string,
    name: string,
    date: Date,
    location: string,
    description: string,
    maxCapacity: number,
    availableCapacity: number,
    image: string,
}
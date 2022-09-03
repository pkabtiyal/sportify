/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { EventInterface } from "./EventInterface";

let availableEvents: EventInterface[] = [
    {
        id: '1',
        name: 'Sunday Yoga',
        date: new Date(2022, 6, 26),
        location: 'Room - 234',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 200,
        availableCapacity: 20,
        image: './yoga.svg',
    },
    {
        id: '2',
        name: 'Monday Meditation',
        date: new Date(2022, 6, 27),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 100,
        availableCapacity: 5,
        image: './meditation.svg',
    },
    {
        id: '4',
        name: 'Wednesday Zumba',
        date: new Date(2022, 6, 29),
        location: 'Room - 200',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 1,
        image: './zumba.svg',
    },
    {
        id: '5',
        name: 'Thursday Yoga',
        date: new Date(2022, 7, 30),
        location: 'Room - 290',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 200,
        availableCapacity: 100,
        image: './yoga2.svg',
    },
    {
        id: '6',
        name: 'Tuesday Meditation',
        date: new Date(2022, 7, 20),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
    {
        id: '7',
        name: 'Tuesday Meditation',
        date: new Date(2022, 7, 15),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
    {
        id: '8',
        name: 'Tuesday Meditation',
        date: new Date(2022, 8, 28),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
    {
        id: '9',
        name: 'Tuesday Meditation',
        date: new Date(2022, 7, 5),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
    {
        id: '10',
        name: 'Tuesday Meditation',
        date: new Date(2022, 7, 5),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
    {
        id: '11',
        name: 'Tuesday Meditation',
        date: new Date(2022, 7, 15),
        location: 'Room - 283',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        maxCapacity: 50,
        availableCapacity: 3,
        image: './meditation.svg',
    },
]

export default availableEvents;
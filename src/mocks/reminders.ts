export interface Reminder {
    id: string;
    text: string;
    date: string;
    time: string;
    created: string;
}

export const mockReminders: Reminder[] = [
    {
        id: '1',
        text: 'Call mom for her birthday',
        date: '2024-04-15',
        time: '14:00',
        created: '2024-04-10T10:00:00Z'
    },
    {
        id: '2',
        text: 'Buy groceries for the week',
        date: '2024-04-12',
        time: '18:30',
        created: '2024-04-09T15:30:00Z'
    },
    {
        id: '3',
        text: 'Dentist appointment',
        date: '2024-04-20',
        time: '09:00',
        created: '2024-04-08T11:20:00Z'
    },
    {
        id: '4',
        text: 'Team meeting with new client',
        date: '2024-04-16',
        time: '11:00',
        created: '2024-04-07T16:45:00Z'
    },
    {
        id: '5',
        text: 'Pay electricity bill',
        date: '2024-04-25',
        time: '12:00',
        created: '2024-04-06T09:15:00Z'
    },
    {
        id: '6',
        text: 'Gym session with trainer',
        date: '2024-04-14',
        time: '19:00',
        created: '2024-04-05T14:30:00Z'
    },
    {
        id: '7',
        text: 'Submit project report',
        date: '2024-04-18',
        time: '17:00',
        created: '2024-04-04T10:20:00Z'
    }
]; 
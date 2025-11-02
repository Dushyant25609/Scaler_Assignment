import { Event, Task, AppointmentSchedule, Calendar, TaskList } from '../types';

// In-memory data store (replace with database in production)
export const eventsStore: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: '2025-11-03',
    startTime: '10:00am',
    endTime: '11:00am',
    isAllDay: false,
    guests: 'john@example.com, jane@example.com',
    location: 'Conference Room A',
    description: 'Weekly team sync meeting',
    calendarId: 'calendar-1',
    repeatOption: 'Weekly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: '2025-11-05',
    startTime: '9:00am',
    endTime: '5:00pm',
    isAllDay: true,
    calendarId: 'calendar-1',
    repeatOption: 'Does not repeat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const tasksStore: Task[] = [
  {
    id: '1',
    title: 'Complete presentation',
    date: '2025-11-04',
    time: '2:00pm',
    deadline: '2025-11-04',
    description: 'Finish Q4 presentation slides',
    taskListId: 'my-tasks',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Review code',
    date: '2025-11-03',
    time: '11:00am',
    taskListId: 'my-tasks',
    isCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const appointmentsStore: AppointmentSchedule[] = [
  {
    id: '1',
    title: 'Client Meeting',
    date: '2025-11-06',
    startTime: '2:00pm',
    endTime: '3:00pm',
    calendarId: 'calendar-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const calendarsStore: Calendar[] = [
  {
    id: 'calendar-1',
    name: 'Dushyant',
    color: '#1A73E8',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'calendar-2',
    name: 'Work',
    color: '#D50000',
    isVisible: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'calendar-3',
    name: 'Personal',
    color: '#F4511E',
    isVisible: true,
    createdAt: new Date().toISOString()
  }
];

export const taskListsStore: TaskList[] = [
  {
    id: 'my-tasks',
    name: 'My Tasks',
    count: 2,
    createdAt: new Date().toISOString()
  }
];

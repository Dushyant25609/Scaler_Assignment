# Calendar Store and Services Architecture

This document describes the modular architecture for the calendar application's data layer.

## 📁 Project Structure

```
frontend/src/
├── services/              # API service layer
│   ├── api.ts            # Base API configuration and utilities
│   ├── eventService.ts   # Event CRUD operations
│   ├── taskService.ts    # Task CRUD operations
│   ├── appointmentService.ts  # Appointment CRUD operations
│   ├── calendarService.ts     # Calendar CRUD operations
│   ├── taskListService.ts     # Task list CRUD operations
│   └── index.ts          # Barrel export for all services
├── store/
│   └── calendarStore.ts  # Zustand store with state management
└── types/
    └── calendar.ts       # Shared TypeScript interfaces
```

## 🏗️ Architecture Overview

### **1. Service Layer** (`/services`)

The service layer handles all HTTP communication with the backend API. Each service is responsible for a specific domain.

#### **Base API (`api.ts`)**
- Centralized API configuration
- Generic response handler
- Reusable fetch wrapper with error handling

```typescript
import { apiFetch, API_BASE_URL } from '@/services/api';
```

#### **Domain Services**

Each service provides clean, promise-based methods:

```typescript
// Example: Event Service
import { eventService } from '@/services';

// Fetch all events
const events = await eventService.getAll();

// Fetch with filters
const events = await eventService.getAll({
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  calendarId: 'calendar-id'
});

// Create event
const newEvent = await eventService.create({
  title: 'Meeting',
  date: '2025-11-10',
  calendarId: 'calendar-id'
});

// Update event
const updated = await eventService.update('event-id', { title: 'Updated' });

// Delete event
await eventService.delete('event-id');
```

### **2. State Management** (`/store`)

The Zustand store manages:
- **UI State**: View modes, date selection, sidebar state
- **Data State**: Cached entities (events, tasks, calendars, etc.)
- **Loading State**: API request status
- **Error State**: API error messages

#### **Store Architecture**

```typescript
import { useCalendarStore } from '@/store/calendarStore';

// In components
const Component = () => {
  const { 
    events,           // Data state
    loading,          // Loading state
    error,            // Error state
    createEvent,      // Action
    fetchEvents,      // Action
  } = useCalendarStore();

  // Use the store
  useEffect(() => {
    fetchEvents();
  }, []);

  return <div>...</div>;
};
```

### **3. Type Definitions** (`/types`)

Centralized TypeScript interfaces ensure type safety across the application.

```typescript
import type { Event, Task, Calendar } from '@/types/calendar';
```

## 🔄 Data Flow

```
Component → Store Action → Service → Backend API
                ↓
Component ← Store State ← Service Response
```

1. **Component** calls a store action
2. **Store** sets loading state and calls service
3. **Service** makes HTTP request to backend
4. **Service** returns typed data or throws error
5. **Store** updates state with data or error
6. **Component** re-renders with new state

## 📚 API Reference

### Events

```typescript
// Fetch events
fetchEvents(params?: {
  startDate?: string;
  endDate?: string;
  calendarId?: string;
}): Promise<void>

// Create event
createEvent(event: Omit<Event, '_id'>): Promise<void>

// Update event
updateEvent(id: string, event: Partial<Event>): Promise<void>

// Delete event
deleteEvent(id: string): Promise<void>
```

### Tasks

```typescript
// Fetch tasks
fetchTasks(params?: {
  taskListId?: string;
  isCompleted?: boolean;
}): Promise<void>

// Create task
createTask(task: Omit<Task, '_id'>): Promise<void>

// Update task
updateTask(id: string, task: Partial<Task>): Promise<void>

// Delete task
deleteTask(id: string): Promise<void>

// Toggle task completion
toggleTaskCompletion(id: string): Promise<void>
```

### Appointments

```typescript
// Fetch appointments
fetchAppointments(params?: {
  calendarId?: string;
  date?: string;
}): Promise<void>

// Create appointment
createAppointment(appointment: Omit<Appointment, '_id'>): Promise<void>

// Update appointment
updateAppointment(id: string, appointment: Partial<Appointment>): Promise<void>

// Delete appointment
deleteAppointment(id: string): Promise<void>
```

### Calendars

```typescript
// Fetch calendars
fetchCalendars(): Promise<void>

// Create calendar
createCalendar(calendar: Omit<Calendar, '_id'>): Promise<void>

// Update calendar
updateCalendar(id: string, calendar: Partial<Calendar>): Promise<void>

// Delete calendar
deleteCalendar(id: string): Promise<void>

// Toggle calendar visibility
toggleCalendarVisibility(id: string): Promise<void>
```

### Task Lists

```typescript
// Fetch task lists
fetchTaskLists(): Promise<void>

// Create task list
createTaskList(taskList: Omit<TaskList, '_id' | 'count'>): Promise<void>

// Update task list
updateTaskList(id: string, taskList: Partial<TaskList>): Promise<void>

// Delete task list
deleteTaskList(id: string): Promise<void>
```

## 💡 Usage Examples

### Initialize Data on App Load

```typescript
// In App.tsx or main layout
import { useEffect } from 'react';
import { useCalendarStore } from '@/store/calendarStore';

function App() {
  const initializeData = useCalendarStore(state => state.initializeData);

  useEffect(() => {
    initializeData(); // Loads all data in parallel
  }, []);

  return <YourApp />;
}
```

### Create an Event

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function CreateEventDialog() {
  const { createEvent, loading } = useCalendarStore();

  const handleSubmit = async (formData) => {
    await createEvent({
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      calendarId: formData.calendarId,
      isAllDay: false,
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Filter and Display Events

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function EventsList() {
  const { events, fetchEvents, loading } = useCalendarStore();

  useEffect(() => {
    fetchEvents({
      startDate: '2025-11-01',
      endDate: '2025-11-30',
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <ul>
      {events.map(event => (
        <li key={event._id}>{event.title}</li>
      ))}
    </ul>
  );
}
```

### Handle Errors

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function Component() {
  const { error, createEvent } = useCalendarStore();

  const handleCreate = async () => {
    await createEvent({ /* ... */ });
    
    if (error) {
      toast.error(error);
    } else {
      toast.success('Event created!');
    }
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

## 🎯 Benefits of This Architecture

### **Separation of Concerns**
- **Services**: Handle API communication only
- **Store**: Manage state and orchestrate services
- **Components**: Focus on UI rendering

### **Reusability**
- Services can be used independently of the store
- Store can be consumed by any component
- Types are shared across the entire app

### **Maintainability**
- Changes to API structure only affect service layer
- Easy to test each layer independently
- Clear data flow makes debugging easier

### **Type Safety**
- Full TypeScript coverage
- Type inference throughout the app
- Compile-time error detection

### **Scalability**
- Easy to add new entities (just create new service)
- Can swap Zustand for another state manager
- Can add middleware (logging, caching, etc.)

## 🔧 Configuration

### Backend URL

Change the API base URL in `/services/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:5001/api';
// or
export const API_BASE_URL = import.meta.env.VITE_API_URL;
```

### Error Handling

Customize error handling in `/services/api.ts`:

```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!data.success) {
    // Custom error handling here
    throw new Error(data.error || 'API request failed');
  }
  
  return data.data;
}
```

## 🧪 Testing

Each layer can be tested independently:

```typescript
// Test services with mocked fetch
describe('eventService', () => {
  it('should fetch events', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: [] })
      })
    );
    
    const events = await eventService.getAll();
    expect(events).toEqual([]);
  });
});

// Test store with mocked services
describe('calendarStore', () => {
  it('should update state on createEvent', async () => {
    // Mock eventService.create
    // Call store action
    // Assert state change
  });
});
```

## 📝 Notes

- All API responses follow the format: `{ success: boolean, data: any, error?: string }`
- The store automatically handles loading and error states
- Task operations automatically refresh task list counts
- All dates should be in ISO 8601 format (`YYYY-MM-DD`)
- IDs are MongoDB ObjectIds (string format)

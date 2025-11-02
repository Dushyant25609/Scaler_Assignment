# Calendar API - Complete Documentation

Base URL: `http://localhost:5001`

## API Testing Examples

### 1. Health Check
```bash
curl http://localhost:5001/
```

## Events API

### Get All Events
```bash
# Get all events
curl http://localhost:5001/api/events

# Get events in date range
curl "http://localhost:5001/api/events?startDate=2025-11-01&endDate=2025-11-30"

# Get events for specific calendar
curl "http://localhost:5001/api/events?calendarId=calendar-1"
```

### Get Event by ID
```bash
curl http://localhost:5001/api/events/1
```

### Create Event
```bash
curl -X POST http://localhost:5001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Team Meeting",
    "date": "2025-11-10",
    "startTime": "2:00pm",
    "endTime": "3:00pm",
    "isAllDay": false,
    "guests": "john@example.com, jane@example.com",
    "location": "Conference Room B",
    "description": "Quarterly review meeting",
    "calendarId": "calendar-1",
    "repeatOption": "Does not repeat"
  }'
```

### Update Event
```bash
curl -X PUT http://localhost:5001/api/events/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Meeting Title",
    "location": "Conference Room C"
  }'
```

### Delete Event
```bash
curl -X DELETE http://localhost:5001/api/events/1
```

## Tasks API

### Get All Tasks
```bash
# Get all tasks
curl http://localhost:5001/api/tasks

# Get tasks from specific list
curl "http://localhost:5001/api/tasks?taskListId=my-tasks"

# Get completed/incomplete tasks
curl "http://localhost:5001/api/tasks?isCompleted=false"
```

### Get Task by ID
```bash
curl http://localhost:5001/api/tasks/1
```

### Create Task
```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "date": "2025-11-05",
    "time": "3:00pm",
    "deadline": "2025-11-05",
    "description": "Task description here",
    "taskListId": "my-tasks",
    "isCompleted": false
  }'
```

### Update Task
```bash
curl -X PUT http://localhost:5001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "isCompleted": true
  }'
```

### Toggle Task Completion
```bash
curl -X PATCH http://localhost:5001/api/tasks/1/toggle
```

### Delete Task
```bash
curl -X DELETE http://localhost:5001/api/tasks/1
```

## Appointments API

### Get All Appointments
```bash
# Get all appointments
curl http://localhost:5001/api/appointments

# Get appointments for specific calendar
curl "http://localhost:5001/api/appointments?calendarId=calendar-1"

# Get appointments for specific date
curl "http://localhost:5001/api/appointments?date=2025-11-06"
```

### Get Appointment by ID
```bash
curl http://localhost:5001/api/appointments/1
```

### Create Appointment
```bash
curl -X POST http://localhost:5001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Doctor Appointment",
    "date": "2025-11-15",
    "startTime": "10:00am",
    "endTime": "11:00am",
    "calendarId": "calendar-1"
  }'
```

### Update Appointment
```bash
curl -X PUT http://localhost:5001/api/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Appointment",
    "startTime": "11:00am"
  }'
```

### Delete Appointment
```bash
curl -X DELETE http://localhost:5001/api/appointments/1
```

## Calendars API

### Get All Calendars
```bash
curl http://localhost:5001/api/calendars
```

### Get Calendar by ID
```bash
curl http://localhost:5001/api/calendars/calendar-1
```

### Create Calendar
```bash
curl -X POST http://localhost:5001/api/calendars \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work Calendar",
    "color": "#FF5733",
    "isVisible": true
  }'
```

### Update Calendar
```bash
curl -X PUT http://localhost:5001/api/calendars/calendar-1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Calendar Name",
    "color": "#00FF00"
  }'
```

### Toggle Calendar Visibility
```bash
curl -X PATCH http://localhost:5001/api/calendars/calendar-1/toggle
```

### Delete Calendar
```bash
curl -X DELETE http://localhost:5001/api/calendars/calendar-1
```

## Task Lists API

### Get All Task Lists
```bash
curl http://localhost:5001/api/task-lists
```

### Get Task List by ID
```bash
curl http://localhost:5001/api/task-lists/my-tasks
```

### Create Task List
```bash
curl -X POST http://localhost:5001/api/task-lists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal Projects"
  }'
```

### Update Task List
```bash
curl -X PUT http://localhost:5001/api/task-lists/my-tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated List Name"
  }'
```

### Delete Task List
```bash
curl -X DELETE http://localhost:5001/api/task-lists/my-tasks
```

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Optional detailed message"
}
```

## Status Codes

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Frontend Integration

To use this API in your React frontend, update the base URL:

```typescript
const API_BASE_URL = 'http://localhost:5001/api';

// Example: Fetch all events
const fetchEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events`);
  const data = await response.json();
  return data;
};

// Example: Create event
const createEvent = async (eventData) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  const data = await response.json();
  return data;
};
```

## Notes

- The backend uses in-memory storage. Data will be reset when the server restarts.
- To persist data, integrate a database (MongoDB, PostgreSQL, etc.)
- CORS is enabled for all origins in development
- All timestamps are in ISO 8601 format

# Calendar Backend API

Express + TypeScript backend for Google Calendar Clone application.

## Features

- RESTful API with TypeScript
- In-memory data storage (easily replaceable with database)
- CORS enabled
- Error handling middleware
- Request logging

## Installation

```bash
cd backend
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Events
- `GET /api/events` - Get all events (optional query: startDate, endDate, calendarId)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Tasks
- `GET /api/tasks` - Get all tasks (optional query: taskListId, isCompleted)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### Appointments
- `GET /api/appointments` - Get all appointments (optional query: calendarId, date)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Calendars
- `GET /api/calendars` - Get all calendars
- `GET /api/calendars/:id` - Get calendar by ID
- `POST /api/calendars` - Create new calendar
- `PUT /api/calendars/:id` - Update calendar
- `DELETE /api/calendars/:id` - Delete calendar
- `PATCH /api/calendars/:id/toggle` - Toggle calendar visibility

### Task Lists
- `GET /api/task-lists` - Get all task lists
- `GET /api/task-lists/:id` - Get task list by ID
- `POST /api/task-lists` - Create new task list
- `PUT /api/task-lists/:id` - Update task list
- `DELETE /api/task-lists/:id` - Delete task list

## Request/Response Format

### Create Event Example
```json
POST /api/events
{
  "title": "Team Meeting",
  "date": "2025-11-03",
  "startTime": "10:00am",
  "endTime": "11:00am",
  "isAllDay": false,
  "guests": "john@example.com",
  "location": "Conference Room",
  "description": "Weekly sync",
  "calendarId": "calendar-1",
  "repeatOption": "Weekly"
}
```

### Create Task Example
```json
POST /api/tasks
{
  "title": "Complete presentation",
  "date": "2025-11-04",
  "time": "2:00pm",
  "deadline": "2025-11-04",
  "description": "Finish slides",
  "taskListId": "my-tasks",
  "isCompleted": false
}
```

### Create Task List Example
```json
POST /api/task-lists
{
  "name": "Personal Projects"
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
NODE_ENV=development
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── data/            # In-memory data store
│   ├── types/           # TypeScript types
│   └── index.ts         # App entry point
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

## Future Enhancements

- Add database integration (MongoDB, PostgreSQL)
- Add authentication (JWT)
- Add input validation middleware
- Add rate limiting
- Add API documentation (Swagger)
- Add unit tests

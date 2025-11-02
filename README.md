# Scaler_Assignment
# 📅 Google Calendar Clone

A full-stack calendar application built with React, TypeScript, Express, and modern UI components. Features event management, task tracking, multiple calendar views, and a responsive design.

![Calendar Application](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Express](https://img.shields.io/badge/Express-4+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 📆 Calendar Management
- **Multiple Views**: Day, Week, Month, Year, 4-day, and Schedule views
- **Event Management**: Create, edit, delete, and view events
- **Recurring Events**: Support for repeating events
- **Calendar Organization**: Multiple calendars with toggle visibility
- **All-Day Events**: Support for full-day events

### ✅ Task Management
- **Task Lists**: Organize tasks into custom lists
- **Task Tracking**: Create, complete, and manage tasks
- **Deadlines**: Set due dates and times for tasks
- **Task Completion**: Toggle task status with visual feedback

### 📱 User Interface
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Modern dark theme interface
- **Collapsible Sidebar**: Expandable/collapsible navigation
- **Intuitive Navigation**: Easy switching between views and modes
- **Real-time Updates**: Instant UI updates on data changes

## 🏗️ Architecture

```
assignment/
├── backend/              # Express TypeScript API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── data/        # In-memory data store
│   │   └── types/       # TypeScript definitions
│   └── API_DOCUMENTATION.md
├── frontend/            # React TypeScript App
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   ├── store/       # Zustand state management
│   │   ├── types/       # TypeScript interfaces
│   │   └── pages/       # Application pages
│   └── ARCHITECTURE.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

3. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📚 Documentation

### Backend API

The backend provides a RESTful API with the following endpoints:

#### Events API
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

#### Tasks API
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task

#### Calendars API
- `GET /api/calendars` - Get all calendars
- `POST /api/calendars` - Create new calendar
- `PATCH /api/calendars/:id/toggle` - Toggle calendar visibility

#### Task Lists API
- `GET /api/task-lists` - Get all task lists
- `POST /api/task-lists` - Create new task list

Full API documentation: [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md)

### Frontend Architecture

The frontend uses a modular architecture with:

- **Service Layer**: API communication handlers
- **State Management**: Zustand store for global state
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Shadcn UI components

Full architecture documentation: [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **date-fns** - Date utilities

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin support
- **Nodemon** - Development auto-reload

## 📖 Usage Examples

### Creating an Event

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function Component() {
  const { createEvent } = useCalendarStore();

  const handleCreate = async () => {
    await createEvent({
      title: 'Team Meeting',
      date: '2025-11-10',
      startTime: '10:00am',
      endTime: '11:00am',
      calendarId: 'calendar-1',
      isAllDay: false
    });
  };
}
```

### Creating a Task

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function Component() {
  const { createTask } = useCalendarStore();

  const handleCreate = async () => {
    await createTask({
      title: 'Complete documentation',
      date: '2025-11-10',
      taskListId: 'my-tasks',
      isCompleted: false
    });
  };
}
```

### Switching Calendar Views

```typescript
import { useCalendarStore } from '@/store/calendarStore';

function Component() {
  const { setCurrentView } = useCalendarStore();

  return (
    <button onClick={() => setCurrentView('Week')}>
      Week View
    </button>
  );
}
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔧 Configuration

### Environment Variables

**Backend** (`.env` in `backend/` directory):
```env
PORT=5001
NODE_ENV=development
```

**Frontend** (`.env` in `frontend/` directory):
```env
VITE_API_URL=http://localhost:5001/api
```

### API Base URL

To change the API endpoint, edit [`frontend/src/services/api.ts`](frontend/src/services/api.ts):
```typescript
export const API_BASE_URL = 'http://localhost:5001/api';
```

## 📦 Building for Production

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** for code formatting (recommended)

Run linting:
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

## 🗺️ Roadmap

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication (JWT)
- [ ] Real-time collaboration (WebSockets)
- [ ] Email notifications
- [ ] Calendar sharing
- [ ] Import/Export calendar data
- [ ] Mobile app (React Native)
- [ ] Drag-and-drop event rescheduling
- [ ] Event reminders
- [ ] Advanced search and filtering

## 🐛 Known Issues

- In-memory storage resets on server restart
- No authentication/authorization
- Limited recurring event options

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Lucide](https://lucide.dev/) for icons
- [Zustand](https://github.com/pmndrs/zustand) for state management
- Google Calendar for inspiration

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using React and TypeScript
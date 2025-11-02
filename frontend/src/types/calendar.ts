// Shared types for calendar application

export interface CalendarEvent {
  _id?: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  guests?: string;
  location?: string;
  description?: string;
  calendarId: string;
  repeatOption?: string;
}

export interface Task {
  _id?: string;
  title: string;
  date?: string;
  time?: string;
  deadline?: string;
  description?: string;
  taskListId: string;
  isCompleted: boolean;
}

export interface Appointment {
  _id?: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarId: string;
}

export interface Calendar {
  _id?: string;
  name: string;
  color: string;
  isVisible: boolean;
}

export interface TaskList {
  _id?: string;
  name: string;
  count?: number;
}

// Query parameter types
export interface FetchEventsParams {
  startDate?: string;
  endDate?: string;
  calendarId?: string;
}

// Query parameter types
export interface FetchEventsParams {
  startDate?: string;
  endDate?: string;
  calendarId?: string;
}

export interface FetchTasksParams {
  taskListId?: string;
  isCompleted?: boolean;
}

export interface FetchAppointmentsParams {
  calendarId?: string;
  date?: string;
}

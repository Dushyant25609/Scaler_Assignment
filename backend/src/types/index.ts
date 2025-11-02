export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  guests?: string;
  location?: string;
  description?: string;
  calendarId: string;
  repeatOption: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  time?: string;
  deadline?: string;
  description?: string;
  taskListId: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentSchedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  createdAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

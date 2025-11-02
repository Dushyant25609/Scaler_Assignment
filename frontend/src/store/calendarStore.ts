import { create } from 'zustand';
import type {
  CalendarEvent,
  Task,
  Appointment,
  Calendar,
  TaskList,
  FetchEventsParams,
  FetchTasksParams,
  FetchAppointmentsParams,
} from '../types/calendar';
import {
  eventService,
  taskService,
  appointmentService,
  calendarService,
  taskListService,
} from '../services';

interface CalendarState {
  // UI State
  selectedDate: Date;
  viewDate: Date;
  isCalendarOpen: boolean;
  isSidebarCollapsed: boolean;
  currentView: "Day" | "Week" | "Month" | "Year" | "Schedule" | "4 days";
  activeViewToggle: "calendar" | "tasks";
  
  // Data State
  events: CalendarEvent[];
  tasks: Task[];
  appointments: Appointment[];
  calendars: Calendar[];
  taskLists: TaskList[];
  loading: boolean;
  error: string | null;

  // UI Actions
  setSelectedDate: (date: Date) => void;
  setViewDate: (date: Date) => void;
  setIsCalendarOpen: (isOpen: boolean) => void;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setCurrentView: (view: "Day" | "Week" | "Month" | "Year" | "Schedule" | "4 days") => void;
  setActiveViewToggle: (toggle: "calendar" | "tasks") => void;
  toggleSidebar: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  handleTodayClick: () => void;
  handleDateClick: (date: Date) => void;
  toggleCalendar: () => void;

  // Event Actions
  fetchEvents: (params?: FetchEventsParams) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, '_id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Task Actions
  fetchTasks: (params?: FetchTasksParams) => Promise<void>;
  createTask: (task: Omit<Task, '_id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;

  // Appointment Actions
  fetchAppointments: (params?: FetchAppointmentsParams) => Promise<void>;
  createAppointment: (appointment: Omit<Appointment, '_id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  // Calendar Actions
  fetchCalendars: () => Promise<void>;
  createCalendar: (calendar: Omit<Calendar, '_id'>) => Promise<void>;
  updateCalendar: (id: string, calendar: Partial<Calendar>) => Promise<void>;
  deleteCalendar: (id: string) => Promise<void>;
  toggleCalendarVisibility: (id: string) => Promise<void>;

  // Task List Actions
  fetchTaskLists: () => Promise<void>;
  createTaskList: (taskList: Omit<TaskList, '_id' | 'count'>) => Promise<void>;
  updateTaskList: (id: string, taskList: Partial<TaskList>) => Promise<void>;
  deleteTaskList: (id: string) => Promise<void>;

  // Initialize all data
  initializeData: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  // UI State
  selectedDate: new Date(),
  viewDate: new Date(),
  isCalendarOpen: false,
  isSidebarCollapsed: false,
  currentView: "Day",
  activeViewToggle: "calendar",
  
  // Data State
  events: [],
  tasks: [],
  appointments: [],
  calendars: [],
  taskLists: [],
  loading: false,
  error: null,

  // UI Actions
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setViewDate: (date) => set({ viewDate: date }),
  
  setIsCalendarOpen: (isOpen) => set({ isCalendarOpen: isOpen }),

  setIsSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),

  setCurrentView: (view) => set({ currentView: view }),

  setActiveViewToggle: (toggle) => set({ activeViewToggle: toggle }),

  toggleSidebar: () => {
    const { isSidebarCollapsed } = get();
    set({ isSidebarCollapsed: !isSidebarCollapsed });
  },

  handlePrevMonth: () => {
    const { viewDate } = get();
    set({ viewDate: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1) });
  },

  handleNextMonth: () => {
    const { viewDate } = get();
    set({ viewDate: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1) });
  },

  handlePrevDay: () => {
    const { selectedDate } = get();
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    set({ selectedDate: newDate, viewDate: newDate });
  },

  handleNextDay: () => {
    const { selectedDate } = get();
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    set({ selectedDate: newDate, viewDate: newDate });
  },

  handleTodayClick: () => {
    const todayDate = new Date();
    set({ selectedDate: todayDate, viewDate: todayDate });
  },

  handleDateClick: (date) => {
    set({ selectedDate: date, viewDate: date, isCalendarOpen: false });
  },

  toggleCalendar: () => {
    const { isCalendarOpen } = get();
    set({ isCalendarOpen: !isCalendarOpen });
  },

  // Event Actions
  fetchEvents: async (params) => {
    set({ loading: true, error: null });
    try {
      const events = await eventService.getAll(params);
      set({ events, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const newEvent = await eventService.create(event);
      set({ events: [...get().events, newEvent], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateEvent: async (id, event) => {
    set({ loading: true, error: null });
    try {
      const updatedEvent = await eventService.update(id, event);
      set({
        events: get().events.map(e => e._id === id ? updatedEvent : e),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await eventService.delete(id);
      set({
        events: get().events.filter(e => e._id !== id),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Task Actions
  fetchTasks: async (params) => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskService.getAll(params);
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.create(task);
      set({ tasks: [...get().tasks, newTask], loading: false });
      // Refresh task lists to update counts
      await get().fetchTaskLists();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTask: async (id, task) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.update(id, task);
      set({
        tasks: get().tasks.map(t => t._id === id ? updatedTask : t),
        loading: false
      });
      // Refresh task lists to update counts
      await get().fetchTaskLists();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await taskService.delete(id);
      set({
        tasks: get().tasks.filter(t => t._id !== id),
        loading: false
      });
      // Refresh task lists to update counts
      await get().fetchTaskLists();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  toggleTaskCompletion: async (id) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.toggleCompletion(id);
      set({
        tasks: get().tasks.map(t => t._id === id ? updatedTask : t),
        loading: false
      });
      // Refresh task lists to update counts
      await get().fetchTaskLists();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Appointment Actions
  fetchAppointments: async (params) => {
    set({ loading: true, error: null });
    try {
      const appointments = await appointmentService.getAll(params);
      set({ appointments, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createAppointment: async (appointment) => {
    set({ loading: true, error: null });
    try {
      const newAppointment = await appointmentService.create(appointment);
      set({ appointments: [...get().appointments, newAppointment], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateAppointment: async (id, appointment) => {
    set({ loading: true, error: null });
    try {
      const updatedAppointment = await appointmentService.update(id, appointment);
      set({
        appointments: get().appointments.map(a => a._id === id ? updatedAppointment : a),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await appointmentService.delete(id);
      set({
        appointments: get().appointments.filter(a => a._id !== id),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Calendar Actions
  fetchCalendars: async () => {
    set({ loading: true, error: null });
    try {
      const calendars = await calendarService.getAll();
      set({ calendars, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createCalendar: async (calendar) => {
    set({ loading: true, error: null });
    try {
      const newCalendar = await calendarService.create(calendar);
      set({ calendars: [...get().calendars, newCalendar], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateCalendar: async (id, calendar) => {
    set({ loading: true, error: null });
    try {
      const updatedCalendar = await calendarService.update(id, calendar);
      set({
        calendars: get().calendars.map(c => c._id === id ? updatedCalendar : c),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteCalendar: async (id) => {
    set({ loading: true, error: null });
    try {
      await calendarService.delete(id);
      set({
        calendars: get().calendars.filter(c => c._id !== id),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  toggleCalendarVisibility: async (id) => {
    set({ loading: true, error: null });
    try {
      const updatedCalendar = await calendarService.toggleVisibility(id);
      set({
        calendars: get().calendars.map(c => c._id === id ? updatedCalendar : c),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Task List Actions
  fetchTaskLists: async () => {
    set({ loading: true, error: null });
    try {
      const taskLists = await taskListService.getAll();
      set({ taskLists, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTaskList: async (taskList) => {
    set({ loading: true, error: null });
    try {
      const newTaskList = await taskListService.create(taskList);
      set({ taskLists: [...get().taskLists, newTaskList], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTaskList: async (id, taskList) => {
    set({ loading: true, error: null });
    try {
      const updatedTaskList = await taskListService.update(id, taskList);
      set({
        taskLists: get().taskLists.map(tl => tl._id === id ? updatedTaskList : tl),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTaskList: async (id) => {
    set({ loading: true, error: null });
    try {
      await taskListService.delete(id);
      set({
        taskLists: get().taskLists.filter(tl => tl._id !== id),
        loading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  // Initialize all data
  initializeData: async () => {
    await Promise.all([
      get().fetchEvents(),
      get().fetchTasks(),
      get().fetchAppointments(),
      get().fetchCalendars(),
      get().fetchTaskLists(),
    ]);
  },
}));

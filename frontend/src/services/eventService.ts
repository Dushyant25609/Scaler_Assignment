import { apiFetch } from './api';
import type { CalendarEvent, FetchEventsParams } from '../types/calendar';

export const eventService = {
  // Get all events with optional filters
  async getAll(params?: FetchEventsParams): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.calendarId) queryParams.append('calendarId', params.calendarId);
    
    const query = queryParams.toString();
    return apiFetch<CalendarEvent[]>(`/events${query ? `?${query}` : ''}`);
  },

  // Get single event by ID
  async getById(id: string): Promise<CalendarEvent> {
    return apiFetch<CalendarEvent>(`/events/${id}`);
  },

  // Create new event
  async create(event: Omit<CalendarEvent, '_id'>): Promise<CalendarEvent> {
    return apiFetch<CalendarEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  // Update existing event
  async update(id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return apiFetch<CalendarEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  },

  // Delete event
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

import { apiFetch } from './api';
import type { Calendar } from '../types/calendar';

export const calendarService = {
  // Get all calendars
  async getAll(): Promise<Calendar[]> {
    return apiFetch<Calendar[]>('/calendars');
  },

  // Get single calendar by ID
  async getById(id: string): Promise<Calendar> {
    return apiFetch<Calendar>(`/calendars/${id}`);
  },

  // Create new calendar
  async create(calendar: Omit<Calendar, '_id'>): Promise<Calendar> {
    return apiFetch<Calendar>('/calendars', {
      method: 'POST',
      body: JSON.stringify(calendar),
    });
  },

  // Update existing calendar
  async update(id: string, calendar: Partial<Calendar>): Promise<Calendar> {
    return apiFetch<Calendar>(`/calendars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(calendar),
    });
  },

  // Delete calendar
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/calendars/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle calendar visibility
  async toggleVisibility(id: string): Promise<Calendar> {
    return apiFetch<Calendar>(`/calendars/${id}/toggle`, {
      method: 'PATCH',
    });
  },
};

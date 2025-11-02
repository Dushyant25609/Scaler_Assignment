import { apiFetch } from './api';
import type { Appointment, FetchAppointmentsParams } from '../types/calendar';

export const appointmentService = {
  // Get all appointments with optional filters
  async getAll(params?: FetchAppointmentsParams): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();
    if (params?.calendarId) queryParams.append('calendarId', params.calendarId);
    if (params?.date) queryParams.append('date', params.date);
    
    const query = queryParams.toString();
    return apiFetch<Appointment[]>(`/appointments${query ? `?${query}` : ''}`);
  },

  // Get single appointment by ID
  async getById(id: string): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${id}`);
  },

  // Create new appointment
  async create(appointment: Omit<Appointment, '_id'>): Promise<Appointment> {
    return apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },

  // Update existing appointment
  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  },

  // Delete appointment
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

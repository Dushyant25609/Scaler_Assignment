import { apiFetch } from './api';
import type { Task, FetchTasksParams } from '../types/calendar';

export const taskService = {
  // Get all tasks with optional filters
  async getAll(params?: FetchTasksParams): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    if (params?.taskListId) queryParams.append('taskListId', params.taskListId);
    if (params?.isCompleted !== undefined) {
      queryParams.append('isCompleted', String(params.isCompleted));
    }
    
    const query = queryParams.toString();
    return apiFetch<Task[]>(`/tasks${query ? `?${query}` : ''}`);
  },

  // Get single task by ID
  async getById(id: string): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`);
  },

  // Create new task
  async create(task: Omit<Task, '_id'>): Promise<Task> {
    return apiFetch<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  // Update existing task
  async update(id: string, task: Partial<Task>): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  // Delete task
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle task completion
  async toggleCompletion(id: string): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },
};

import { apiFetch } from './api';
import type { TaskList } from '../types/calendar';

export const taskListService = {
  // Get all task lists
  async getAll(): Promise<TaskList[]> {
    return apiFetch<TaskList[]>('/task-lists');
  },

  // Get single task list by ID
  async getById(id: string): Promise<TaskList> {
    return apiFetch<TaskList>(`/task-lists/${id}`);
  },

  // Create new task list
  async create(taskList: Omit<TaskList, '_id' | 'count'>): Promise<TaskList> {
    return apiFetch<TaskList>('/task-lists', {
      method: 'POST',
      body: JSON.stringify(taskList),
    });
  },

  // Update existing task list
  async update(id: string, taskList: Partial<TaskList>): Promise<TaskList> {
    return apiFetch<TaskList>(`/task-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskList),
    });
  },

  // Delete task list
  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/task-lists/${id}`, {
      method: 'DELETE',
    });
  },
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
}

export interface TaskFiltersState {
  search: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  tag: string;
}

import { apiClient } from '../../api/client';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiClient.get<any>('/tasks');
      const raw = Array.isArray(res) ? res : res?.data || res?.tasks || [];
      if (!Array.isArray(raw)) return [];
      return raw.map((item: any) => ({
        id: item.id || `task_${Date.now()}`,
        title: item.title || 'Untitled Task',
        description: item.description || '',
        status:
          typeof item.status === 'string'
            ? (item.status.toLowerCase().replace('-', '_') as Task['status'])
            : 'todo',
        priority:
          typeof item.priority === 'string'
            ? (item.priority.toLowerCase() as Task['priority'])
            : 'medium',
        dueDate: item.dueDate,
        tags: Array.isArray(item.tags) ? item.tags : ['general'],
      }));
    } catch {
      return [];
    }
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const res = await apiClient.post<any>('/tasks', task);
    const item = res?.data || res;
    return {
      id: item.id || `task_${Date.now()}`,
      title: item.title || task.title,
      description: item.description || task.description || '',
      status: (item.status || task.status || 'todo').toLowerCase(),
      priority: (item.priority || task.priority || 'medium').toLowerCase(),
      dueDate: item.dueDate || task.dueDate,
      tags: Array.isArray(item.tags) ? item.tags : task.tags || ['general'],
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await apiClient.put<any>(`/tasks/${id}`, updates);
    const item = res?.data || res;
    return {
      id: item.id || id,
      title: item.title || 'Updated Task',
      description: item.description || '',
      status: (item.status || updates.status || 'todo').toLowerCase(),
      priority: (item.priority || updates.priority || 'medium').toLowerCase(),
      dueDate: item.dueDate || updates.dueDate,
      tags: Array.isArray(item.tags) ? item.tags : updates.tags || ['general'],
    };
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};

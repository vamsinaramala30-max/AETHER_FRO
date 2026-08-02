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

let mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Optimize React rendering in dashboard',
    description: 'Profile re-renders on theme change.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-07-25',
    tags: ['performance', 'frontend'],
  },
  {
    id: 't2',
    title: 'Implement JWT Token Refresh Interceptor',
    description: 'Handle 401 errors gracefully across API client instances.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-07-28',
    tags: ['auth', 'backend'],
  },
  {
    id: 't3',
    title: 'Refactor Global Sidebar Layout',
    description: 'Ensure perfect layout alignment across all screen resolutions.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-07-18',
    tags: ['ui', 'responsive'],
  },
];

import { apiClient } from '../../api/client';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiClient.get<any>('/tasks');
      const raw = Array.isArray(res) ? res : res?.data || res?.tasks || mockTasks;
      if (!Array.isArray(raw)) return [...mockTasks];
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
        dueDate: item.dueDate || '2026-08-05',
        tags: Array.isArray(item.tags) ? item.tags : ['general'],
      }));
    } catch {
      return [...mockTasks];
    }
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
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
    } catch {
      const newTask: Task = { ...task, id: `task_${String(Date.now())}` };
      mockTasks.push(newTask);
      return newTask;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
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
    } catch {
      const index = mockTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      const updated = { ...mockTasks[index], ...updates };
      mockTasks[index] = updated;
      return updated;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch {
      mockTasks = mockTasks.filter((t) => t.id !== id);
    }
  },
};

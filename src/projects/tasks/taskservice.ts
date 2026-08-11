import { tasksApi } from '../../api/tasks.api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags: string[];
  createdAt?: string;
}

export interface TaskFiltersState {
  search: string;
  status: 'all' | 'todo' | 'in_progress' | 'review' | 'done' | 'overdue';
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  sortBy: 'newest' | 'oldest' | 'dueDate' | 'priority';
  tag: string;
}

const mapStatusToApi = (
  status?: Task['status'],
): 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | undefined => {
  if (!status) return undefined;
  switch (status) {
    case 'todo':
      return 'TODO';
    case 'in_progress':
      return 'IN_PROGRESS';
    case 'review':
      return 'IN_REVIEW';
    case 'done':
      return 'DONE';
  }
};

const mapStatusFromApi = (status?: string): Task['status'] => {
  if (!status) return 'todo';
  const lower = status.toLowerCase();
  if (lower.includes('progress') || lower.includes('execution')) return 'in_progress';
  if (lower.includes('review')) return 'review';
  if (lower.includes('done') || lower.includes('completed')) return 'done';
  return 'todo';
};

const mapPriorityToApi = (priority?: Task['priority']): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | undefined => {
  if (!priority) return undefined;
  return priority.toUpperCase() as any;
};

const mapPriorityFromApi = (priority?: string): Task['priority'] => {
  if (!priority) return 'medium';
  const lower = priority.toLowerCase();
  if (lower.includes('urgent') || lower.includes('critical')) return 'urgent';
  if (lower.includes('high')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const res = await tasksApi.getAll();
    const raw = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    return raw.map((item: any) => ({
      id: item.id,
      title: item.title || 'Untitled Task',
      description: item.description || '',
      status: mapStatusFromApi(item.status),
      priority: mapPriorityFromApi(item.priority),
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : undefined,
      tags: Array.isArray(item.labels) ? item.labels : ['general'],
      createdAt: item.createdAt || new Date().toISOString(),
    }));
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const res = await tasksApi.create({
      title: task.title,
      description: task.description,
      status: mapStatusToApi(task.status),
      priority: mapPriorityToApi(task.priority),
      dueDate: task.dueDate,
      labels: task.tags,
    });
    const item: any = res.data || res;
    return {
      id: item.id,
      title: item.title || task.title,
      description: item.description || task.description || '',
      status: mapStatusFromApi(item.status || task.status),
      priority: mapPriorityFromApi(item.priority || task.priority),
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : task.dueDate,
      tags: item.labels || task.tags || ['general'],
      createdAt: item.createdAt || new Date().toISOString(),
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await tasksApi.update(id, {
      title: updates.title,
      description: updates.description,
      status: mapStatusToApi(updates.status),
      priority: mapPriorityToApi(updates.priority),
      dueDate: updates.dueDate,
      labels: updates.tags,
    });
    const item: any = res.data || res;
    return {
      id: item.id || id,
      title: item.title || updates.title || 'Updated Task',
      description: item.description || updates.description || '',
      status: mapStatusFromApi(item.status || updates.status),
      priority: mapPriorityFromApi(item.priority || updates.priority),
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : updates.dueDate,
      tags: item.labels || updates.tags || ['general'],
      createdAt: item.createdAt || new Date().toISOString(),
    };
  },

  async deleteTask(id: string): Promise<void> {
    await tasksApi.delete(id);
  },
};


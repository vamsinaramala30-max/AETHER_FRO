import { tasksApi } from '../../api/tasks.api';

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

const mapStatusToApi = (status?: Task['status']): 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | undefined => {
  if (!status) return undefined;
  switch (status) {
    case 'todo': return 'TODO';
    case 'in_progress': return 'IN_PROGRESS';
    case 'review': return 'IN_REVIEW';
    case 'done': return 'DONE';
  }
};

const mapStatusFromApi = (status?: string): Task['status'] => {
  if (!status) return 'todo';
  const lower = status.toLowerCase();
  if (lower.includes('progress')) return 'in_progress';
  if (lower.includes('review')) return 'review';
  if (lower.includes('done') || lower.includes('completed')) return 'done';
  return 'todo';
};

const mapPriorityToApi = (priority?: Task['priority']): 'LOW' | 'MEDIUM' | 'HIGH' | undefined => {
  if (!priority) return undefined;
  return priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH';
};

const mapPriorityFromApi = (priority?: string): Task['priority'] => {
  if (!priority) return 'medium';
  const lower = priority.toLowerCase();
  if (lower.includes('high') || lower.includes('urgent')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const res = await tasksApi.getAll();
    const raw = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    return raw.map((item) => ({
      id: item.id,
      title: item.title || 'Untitled Task',
      description: item.description || '',
      status: mapStatusFromApi(item.status),
      priority: mapPriorityFromApi(item.priority),
      dueDate: item.dueDate || undefined,
      tags: Array.isArray(item.labels) ? item.labels : ['general'],
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
    const item = res.data;
    return {
      id: item.id,
      title: item.title,
      description: item.description || '',
      status: mapStatusFromApi(item.status),
      priority: mapPriorityFromApi(item.priority),
      dueDate: item.dueDate || undefined,
      tags: item.labels || task.tags || ['general'],
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
    const item = res.data;
    return {
      id: item.id || id,
      title: item.title || updates.title || 'Updated Task',
      description: item.description || updates.description || '',
      status: mapStatusFromApi(item.status || updates.status),
      priority: mapPriorityFromApi(item.priority || updates.priority),
      dueDate: item.dueDate || updates.dueDate,
      tags: item.labels || updates.tags || ['general'],
    };
  },

  async deleteTask(id: string): Promise<void> {
    await tasksApi.delete(id);
  },
};

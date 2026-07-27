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

// In-memory fallback mock database reflecting the production service architecture
let mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Optimize React.memo rendering in dashboard',
    description: 'Profile re-renders on theme change.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-07-25',
    tags: ['performance', 'frontend'],
  },
  {
    id: 't2',
    title: 'Implement JWT Token Refresh Interceptor',
    description: 'Handle 401 errors gracefully across Axios instances.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-07-28',
    tags: ['auth', 'backend'],
  },
  {
    id: 't3',
    title: 'Refactor Global Sidebar Layout',
    description: 'Ensure perfect CSS Grid alignment on 4K displays.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-07-18',
    tags: ['ui', 'responsive'],
  },
];

export const taskService = {
  getTasks(): Promise<Task[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([...mockTasks]);
      }, 400),
    );
  },
  createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return new Promise((resolve) => {
      const newTask: Task = { ...task, id: `task_${String(Date.now())}` };
      mockTasks.push(newTask);
      setTimeout(() => {
        resolve(newTask);
      }, 300);
    });
  },
  updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return new Promise((resolve, reject) => {
      const index = mockTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        reject(new Error('Task not found'));
        return;
      }
      const updated = { ...mockTasks[index], ...updates };
      mockTasks[index] = updated;
      setTimeout(() => {
        resolve(updated);
      }, 200);
    });
  },
  deleteTask(id: string): Promise<void> {
    return new Promise((resolve) => {
      mockTasks = mockTasks.filter((t) => t.id !== id);
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },
};

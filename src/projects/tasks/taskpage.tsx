import React, { useState, useEffect, useMemo } from 'react';
import { taskService, Task, TaskFiltersState } from './taskservice';
import { TaskBoard } from './taskboard';
import { TaskForm } from './taskform';
import { TaskFilters } from './taskfilter';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '@/state/notificationStore';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'newest',
    tag: '',
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to pull system tasks.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = (id: string, nextStatus: Task['status']) => {
    void (async () => {
      try {
        const updated = await taskService.updateTask(id, { status: nextStatus });
        setTasks((prev) =>
          Array.isArray(prev) ? prev.map((t) => (t.id === id ? updated : t)) : [],
        );
        useNotificationStore.getState().addNotification({
          title: 'Task Status Updated',
          description: `Task state changed to ${nextStatus.toUpperCase().replace('_', ' ')}.`,
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Task Transition Error',
          description: 'Failed to transition task state on backend.',
          type: 'project',
        });
      }
    })();
  };

  const handleCreateTask = (rawTask: Omit<Task, 'id'>) => {
    void (async () => {
      try {
        const created = await taskService.createTask(rawTask);
        setTasks((prev) => [...(Array.isArray(prev) ? prev : []), created]);
        useNotificationStore.getState().addNotification({
          title: 'Task Created',
          description: `Task "${created.title}" added to control plane.`,
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Creation Failed',
          description: 'Failed to commit new task to backend database.',
          type: 'project',
        });
      }
    })();
  };

  const handleDeleteTask = (id: string) => {
    void (async () => {
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => (Array.isArray(prev) ? prev.filter((t) => t.id !== id) : []));
        useNotificationStore.getState().addNotification({
          title: 'Task Deleted',
          description: 'Task permanently removed.',
          type: 'project',
        });
      } catch {
        useNotificationStore.getState().addNotification({
          title: 'Deletion Error',
          description: 'Failed to delete task from backend database.',
          type: 'project',
        });
      }
    })();
  };

  const filteredTasks = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const todayStr = new Date().toISOString().split('T')[0];

    const filtered = safeTasks.filter((t) => {
      const titleMatch = t.title
        ? t.title.toLowerCase().includes(filters.search.toLowerCase())
        : false;
      const descMatch = t.description
        ? t.description.toLowerCase().includes(filters.search.toLowerCase())
        : false;
      const matchSearch = titleMatch || descMatch;

      const matchPriority = filters.priority === 'all' || t.priority === filters.priority;
      const hasFilterTag = typeof filters.tag === 'string' && filters.tag.trim() !== '';
      const matchTag =
        !hasFilterTag ||
        (Array.isArray(t.tags) &&
          t.tags.some((tag) => tag.toLowerCase().includes(filters.tag.toLowerCase())));

      let matchStatus = true;
      if (filters.status === 'overdue') {
        matchStatus = Boolean(t.dueDate && t.dueDate < todayStr && t.status !== 'done');
      } else if (filters.status !== 'all') {
        matchStatus = t.status === filters.status;
      }

      return matchSearch && matchPriority && matchTag && matchStatus;
    });

    return filtered.sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      }
      if (filters.sortBy === 'dueDate') {
        return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      }
      if (filters.sortBy === 'priority') {
        const order = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      // default: newest
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [tasks, filters]);

  if (loading)
    return (
      <div className="flex h-64 w-full items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Syncing task sequence...
        </div>
      </div>
    );

  const hasError = typeof error === 'string' && error.trim() !== '';

  return (
    <PageWrapper wide>
      {hasError && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Task Control Plane
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Coordinate implementation layers across AETHER pipelines.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <TaskForm onSubmit={handleCreateTask} />
        <TaskFilters filters={filters} onChange={setFilters} />
        <TaskBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </PageWrapper>
  );
};

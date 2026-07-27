import React, { useState, useEffect, useMemo } from 'react';
import { taskService, Task, TaskFiltersState } from './taskService';
import { TaskBoard } from './TaskBoard';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './taskfilter';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    priority: 'all',
    tag: '',
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch {
        setError('Failed to pull system tasks.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = (id: string, nextStatus: Task['status']) => {
    void (async () => {
      try {
        const updated = await taskService.updateTask(id, { status: nextStatus });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch {
        alert('Failed to transition task state.');
      }
    })();
  };

  const handleCreateTask = (rawTask: Omit<Task, 'id'>) => {
    void (async () => {
      try {
        const created = await taskService.createTask(rawTask);
        setTasks((prev) => [...prev, created]);
      } catch {
        alert('Failed to commit architecture task.');
      }
    })();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchPriority = filters.priority === 'all' || t.priority === filters.priority;
      const hasFilterTag = typeof filters.tag === 'string' && filters.tag.trim() !== '';
      const matchTag =
        !hasFilterTag ||
        t.tags.some((tag) => tag.toLowerCase().includes(filters.tag.toLowerCase()));
      return matchSearch && matchPriority && matchTag;
    });
  }, [tasks, filters]);

  if (loading)
    return (
      <div style={{ color: '#0066cc', padding: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
        Syncing core task sequence...
      </div>
    );

  const hasError = typeof error === 'string' && error.trim() !== '';
  if (hasError)
    return <div style={{ color: '#ff4d4d', padding: '2rem', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', color: '#fff' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Task Control Plane
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontSize: '0.9rem' }}>
            Coordinate implementation layers across AETHER pipelines.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <TaskForm onSubmit={handleCreateTask} />
        <TaskFilters filters={filters} onChange={setFilters} />
        <TaskBoard tasks={filteredTasks} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

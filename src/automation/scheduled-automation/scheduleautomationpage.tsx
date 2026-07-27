// frontend/src/automation/scheduled-automation/ScheduledAutomationPage.tsx
import React, { useEffect, useState } from 'react';
import { automationService, ScheduledTask } from './automationservice';
import { AutomationCard } from './automationcard';
import { ScheduleForm } from './scheduleform';

export const ScheduledAutomationPage: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await automationService.getTasks();
      setTasks(data);
      setError(null);
    } catch {
      setError('Failed to extract active execution scheduler table rows.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await automationService.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError('Task execution scheduler assignment toggling failure.');
    }
  };

  const handleCreateTask = async (
    taskData: Omit<ScheduledTask, 'id' | 'lastExecutionStatus' | 'lastRun'>,
  ) => {
    try {
      await automationService.createTask(taskData);
      setIsFormOpen(false);
      fetchTasks();
    } catch {
      setError('Could not push new metric daemon to the execution stack.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-900/40 bg-red-950/40 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Daemon Cron Registry</h1>
          <p className="text-xs text-slate-400">
            Deploy background threads, metrics gathering schedules, and data compilation routines.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => {
              setIsFormOpen(true);
            }}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
          >
            + Register Routine
          </button>
        )}
      </div>

      {isFormOpen && (
        <ScheduleForm
          onSubmit={handleCreateTask}
          onCancel={() => {
            setIsFormOpen(false);
          }}
        />
      )}

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
          <p className="text-sm text-slate-500">
            No structured routines are currently mapped inside the scheduler kernel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <AutomationCard key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

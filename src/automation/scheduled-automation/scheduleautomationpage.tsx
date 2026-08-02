import React, { useEffect, useState } from 'react';
import { automationService, ScheduledTask } from './automationservice';
import { AutomationCard } from './automationcard';
import { ScheduleForm } from './scheduleform';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Clock, Plus } from 'lucide-react';

export const ScheduledAutomationPage: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await automationService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError('Failed to extract active execution scheduler table rows.');
      setTasks([]);
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
      setTasks((prev) => (Array.isArray(prev) ? prev.map((t) => (t.id === id ? updated : t)) : []));
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

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <PageWrapper>
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Scheduled Automation
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Deploy background cron jobs, recurring tasks, and timed execution routines.
              </p>
            </div>
          </div>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
              Register Routine
            </button>
          )}
        </div>

        {isFormOpen && (
          <ScheduleForm onSubmit={handleCreateTask} onCancel={() => setIsFormOpen(false)} />
        )}

        {safeTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No structured routines are currently mapped inside the scheduler.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {safeTasks.map((task) => (
              <AutomationCard key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

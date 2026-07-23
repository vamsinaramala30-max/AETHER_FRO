// frontend/src/automation/scheduled-automation/ScheduledAutomationPage.tsx
import React, { useEffect, useState } from 'react';
import { automationService, ScheduledTask } from './automationService';
import { AutomationCard } from './AutomationCard';
import { ScheduleForm } from './ScheduleForm';

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
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      setError('Task execution scheduler assignment toggling failure.');
    }
  };

  const handleCreateTask = async (taskData: Omit<ScheduledTask, 'id' | 'lastExecutionStatus' | 'lastRun'>) => {
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
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-xs bg-red-950/40 text-red-400 border border-red-900/40 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Daemon Cron Registry</h1>
          <p className="text-xs text-slate-400">Deploy background threads, metrics gathering schedules, and data compilation routines.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => { setIsFormOpen(true); }}
            className="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            + Register Routine
          </button>
        )}
      </div>

      {isFormOpen && (
        <ScheduleForm
          onSubmit={handleCreateTask}
          onCancel={() => { setIsFormOpen(false); }}
        />
      )}

      {tasks.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
          <p className="text-sm text-slate-500">No structured routines are currently mapped inside the scheduler kernel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <AutomationCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
// frontend/src/automation/scheduled-automation/ScheduleForm.tsx
import React, { useState } from 'react';
import { ScheduledTask } from './automationService';

interface ScheduleFormProps {
  onSubmit: (task: Omit<ScheduledTask, 'id' | 'lastExecutionStatus' | 'lastRun'>) => void;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [cronExpression, setCronExpression] = useState('0 * * * *');
  const [targetEndpoint, setTargetEndpoint] = useState('/v1/tasks/');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cronExpression || !targetEndpoint) return;
    onSubmit({
      name,
      cronExpression,
      targetEndpoint,
      isActive: true,
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5"
    >
      <h3 className="border-b border-slate-800 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-200">
        Schedule Periodic Operational Task
      </h3>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Task Context Label
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Daily Metrics Compilation"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Standard Cron Layout
            </label>
            <input
              type="text"
              required
              placeholder="0 * * * *"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              value={cronExpression}
              onChange={(e) => {
                setCronExpression(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Internal Execution Route
            </label>
            <input
              type="text"
              required
              placeholder="/v1/tasks/target"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              value={targetEndpoint}
              onChange={(e) => {
                setTargetEndpoint(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-800/60 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:bg-slate-800"
        >
          Abort
        </button>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Commit Cron Task
        </button>
      </div>
    </form>
  );
};

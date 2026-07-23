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
      isActive: true
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl space-y-4 max-w-xl">
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
        Schedule Periodic Operational Task
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Task Context Label</label>
          <input
            type="text"
            required
            placeholder="e.g. Daily Metrics Compilation"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            value={name}
            onChange={(e) => { setName(e.target.value); }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Standard Cron Layout</label>
            <input
              type="text"
              required
              placeholder="0 * * * *"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              value={cronExpression}
              onChange={(e) => { setCronExpression(e.target.value); }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Internal Execution Route</label>
            <input
              type="text"
              required
              placeholder="/v1/tasks/target"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              value={targetEndpoint}
              onChange={(e) => { setTargetEndpoint(e.target.value); }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded border border-slate-700 hover:bg-slate-800 text-slate-400 transition-colors"
        >
          Abort
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
        >
          Commit Cron Task
        </button>
      </div>
    </form>
  );
};
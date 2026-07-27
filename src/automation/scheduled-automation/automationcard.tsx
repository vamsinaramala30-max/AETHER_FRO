// frontend/src/automation/scheduled-automation/AutomationCard.tsx
import React from 'react';
import { ScheduledTask } from './automationservice';

interface AutomationCardProps {
  task: ScheduledTask;
  onToggle: (id: string) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({ task, onToggle }) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4 shadow-sm transition-all hover:border-slate-800">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <span className="rounded border border-indigo-900/30 bg-indigo-950/20 px-2 py-0.5 font-mono text-xs text-indigo-400">
            {task.cronExpression}
          </span>

          <button
            onClick={() => {
              onToggle(task.id);
            }}
            className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              task.isActive ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                task.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <h3 className="text-sm font-semibold tracking-tight text-slate-200">{task.name}</h3>

        <div className="truncate rounded border border-slate-900/80 bg-slate-950/60 p-1.5 font-mono text-[11px] text-slate-500">
          {task.targetEndpoint}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${task.lastExecutionStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
          <span className="capitalize text-slate-400">
            {task.lastExecutionStatus || 'Untriggered'}
          </span>
        </div>
        <span className="font-mono text-slate-500">
          {task.lastRun ? new Date(task.lastRun).toLocaleTimeString() : '--:--'}
        </span>
      </div>
    </div>
  );
};

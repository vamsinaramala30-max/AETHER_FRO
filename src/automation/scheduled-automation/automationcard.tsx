import React from 'react';
import { ScheduledTask } from './automationservice';

interface AutomationCardProps {
  task: ScheduledTask;
  onToggle: (id: string) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({ task, onToggle }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            {task.cronExpression}
          </span>

          <button
            onClick={() => onToggle(task.id)}
            className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              task.isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                task.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">{task.name}</h3>

        <div className="truncate rounded-xl border border-slate-200 bg-slate-50 p-2 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
          {task.targetEndpoint}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${task.lastExecutionStatus === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          <span className="font-medium capitalize text-slate-600 dark:text-slate-400">
            {task.lastExecutionStatus || 'Untriggered'}
          </span>
        </div>
        <span className="font-mono text-slate-400">
          {task.lastRun ? new Date(task.lastRun).toLocaleTimeString() : '--:--'}
        </span>
      </div>
    </div>
  );
};

// frontend/src/automation/scheduled-automation/AutomationCard.tsx
import React from 'react';
import { ScheduledTask } from './automationService';

interface AutomationCardProps {
  task: ScheduledTask;
  onToggle: (id: string) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({ task, onToggle }) => {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-800 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-900/30">
            {task.cronExpression}
          </span>
          
          <button
            onClick={() => { onToggle(task.id); }}
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

        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          {task.name}
        </h3>

        <div className="text-[11px] font-mono text-slate-500 bg-slate-950/60 p-1.5 rounded border border-slate-900/80 truncate">
          {task.targetEndpoint}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${task.lastExecutionStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-slate-400 capitalize">{task.lastExecutionStatus || 'Untriggered'}</span>
        </div>
        <span className="text-slate-500 font-mono">
          {task.lastRun ? new Date(task.lastRun).toLocaleTimeString() : '--:--'}
        </span>
      </div>
    </div>
  );
};
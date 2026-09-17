import React from 'react';
import { Clock } from 'lucide-react';
import { WorkflowStep } from '../../automation-types';

interface Props {
  step: WorkflowStep;
  isSelected: boolean;
  onSelect: () => void;
}

export const ScheduleStepCard: React.FC<Props> = ({ step, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4.5 cursor-pointer rounded-2xl border transition-all ${
        isSelected
          ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-500/10 dark:border-amber-400 dark:bg-amber-500/10'
          : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Schedule Recurrence
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
          </div>
        </div>
      </div>
      {step.subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{step.subtitle}</p>
      )}
    </div>
  );
};

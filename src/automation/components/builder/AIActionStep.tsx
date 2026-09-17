import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { WorkflowStep } from '../../automation-types';

interface Props {
  step: WorkflowStep;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const AIActionStepCard: React.FC<Props> = ({ step, isSelected, onSelect, onRemove }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4.5 cursor-pointer rounded-2xl border transition-all ${
        isSelected
          ? 'border-sky-500 bg-sky-500/5 ring-4 ring-sky-500/10 dark:border-sky-400 dark:bg-sky-500/10'
          : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              AI Directive / Logic
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-lg p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {step.subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{step.subtitle}</p>
      )}
    </div>
  );
};

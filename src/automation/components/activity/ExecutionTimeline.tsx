import React from 'react';
import { StepExecutionLog } from '../../automation-types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Props {
  stepLogs: StepExecutionLog[];
}

export const ExecutionTimeline: React.FC<Props> = ({ stepLogs }) => {
  return (
    <div className="relative space-y-4 pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {stepLogs.map((step, i) => (
        <div key={step.stepId || i} className="relative flex items-start gap-3">
          <div className="absolute -left-4 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900">
            {step.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : step.status === 'failed' ? (
              <XCircle className="h-4 w-4 text-rose-500" />
            ) : (
              <Clock className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{step.stepTitle}</span>
              <span className="text-slate-400">{step.durationMs}ms</span>
            </div>
            {step.error && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{step.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

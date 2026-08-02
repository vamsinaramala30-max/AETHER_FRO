import React from 'react';

interface GoalProgressProps {
  progress: number;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ progress }) => {
  const progressPercent = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-500 dark:text-slate-400">Completion</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

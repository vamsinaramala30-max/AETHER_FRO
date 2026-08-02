import React from 'react';
import { FocusTimerData } from './widgetsService';

interface FocusWidgetProps {
  focus: FocusTimerData;
}

export const FocusWidget: React.FC<FocusWidgetProps> = ({ focus }) => {
  const percentage = Math.min(100, (focus.currentSessionMinutes / focus.totalGoalMinutes) * 100);

  return (
    <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-slate-400">Daily Focus Goal</span>
        <span className="text-xs font-bold text-emerald-400">
          {focus.isTimerActive ? 'Active' : 'Paused'}
        </span>
      </div>
      <div className="text-xl font-bold text-white">
        {focus.currentSessionMinutes} / {focus.totalGoalMinutes} min
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
        <div className="h-full bg-emerald-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

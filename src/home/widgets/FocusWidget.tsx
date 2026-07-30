import React from 'react';
import { FocusTimerData } from './widgetsService';

interface FocusWidgetProps {
  focus: FocusTimerData;
}

export const FocusWidget: React.FC<FocusWidgetProps> = ({ focus }) => {
  const percentage = Math.min(100, (focus.currentSessionMinutes / focus.totalGoalMinutes) * 100);

  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold text-slate-400">Daily Focus Goal</span>
        <span className="text-xs font-bold text-emerald-400">{focus.isTimerActive ? 'Active' : 'Paused'}</span>
      </div>
      <div className="text-xl font-bold text-white">
        {focus.currentSessionMinutes} / {focus.totalGoalMinutes} min
      </div>
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
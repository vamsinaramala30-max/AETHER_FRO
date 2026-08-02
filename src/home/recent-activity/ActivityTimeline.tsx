import React from 'react';
import { ActivityItem } from './recentActivityService';

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="relative my-2 space-y-4 border-l-2 border-slate-700 pl-4">
      {activities.map((act) => (
        <div key={act.id} className="relative">
          <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">{act.user.name}</span> {act.action}
          </div>
          <div className="truncate font-mono text-[11px] text-indigo-400">{act.target}</div>
          <div className="text-[10px] text-slate-500">{act.timestamp}</div>
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { ActivityItem } from './recentActivityService';

interface ActivityCardProps {
  activity: ActivityItem;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-700/60 bg-slate-800/60 p-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
        {activity.user.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-snug text-slate-300">
          <span className="font-semibold text-white">{activity.user.name}</span> {activity.action}{' '}
          <span className="break-words font-medium text-indigo-300">{activity.target}</span>
        </p>
        <span className="mt-1 block text-[10px] text-slate-500">{activity.timestamp}</span>
      </div>
    </div>
  );
};

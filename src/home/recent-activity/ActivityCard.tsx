import React from 'react';
import { ActivityItem } from './recentActivityService';

interface ActivityCardProps {
  activity: ActivityItem;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
        {activity.user.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300 leading-snug">
          <span className="font-semibold text-white">{activity.user.name}</span> {activity.action}{' '}
          <span className="text-indigo-300 font-medium break-words">{activity.target}</span>
        </p>
        <span className="text-[10px] text-slate-500 mt-1 block">{activity.timestamp}</span>
      </div>
    </div>
  );
};
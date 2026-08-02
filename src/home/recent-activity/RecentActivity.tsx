import React, { useEffect, useState } from 'react';
import { ActivityItem, fetchRecentActivities } from './recentActivityService';
import { ActivityCard } from './ActivityCard';
import { ActivityTimeline } from './ActivityTimeline';

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  useEffect(() => {
    fetchRecentActivities().then(setActivities);
  }, []);

  return (
    <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Recent Activity</h3>
        <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              viewMode === 'list' ? 'bg-indigo-600 font-medium text-white' : 'text-slate-400'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              viewMode === 'timeline' ? 'bg-indigo-600 font-medium text-white' : 'text-slate-400'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-2">
          {activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      ) : (
        <ActivityTimeline activities={activities} />
      )}
    </section>
  );
};

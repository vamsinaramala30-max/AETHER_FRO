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
    <section className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Recent Activity</h3>
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'timeline' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
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
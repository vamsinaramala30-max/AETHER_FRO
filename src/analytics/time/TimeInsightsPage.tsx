import React from 'react';
import { TimeInsightsSummary } from './timeInsightsService';
import { TimeChart } from './TimeChart';

interface TimeInsightsPageProps {
  data?: TimeInsightsSummary;
  isLoading?: boolean;
}

export const TimeInsightsPage: React.FC<TimeInsightsPageProps> = ({ data, isLoading = false }) => {
  if (isLoading || !data) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Tracked', val: `${data.totalTrackedHours}h`, color: 'text-slate-900 dark:text-white' },
          { label: 'Focus Time', val: `${data.focusTime}h`, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Meetings', val: `${data.meetings}h`, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Learning', val: `${data.learning}h`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Break Time', val: `${data.breakTime}h`, color: 'text-slate-500 dark:text-slate-400' },
          { label: 'Personal', val: `${data.personalProjects}h`, color: 'text-pink-600 dark:text-pink-400' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</p>
            <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Time Allocation Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Visual Breakdown of tracked activities across work sessions.
        </p>
        <TimeChart data={data.distribution} />
      </div>
    </div>
  );
};
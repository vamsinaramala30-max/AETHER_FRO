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
      <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-64 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          {
            label: 'Total Tracked',
            val: `${data.totalTrackedHours}h`,
            color: 'text-slate-900 dark:text-white',
          },
          {
            label: 'Focus Time',
            val: `${data.focusTime}h`,
            color: 'text-indigo-600 dark:text-indigo-400',
          },
          {
            label: 'Meetings',
            val: `${data.meetings}h`,
            color: 'text-amber-600 dark:text-amber-400',
          },
          {
            label: 'Learning',
            val: `${data.learning}h`,
            color: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: 'Break Time',
            val: `${data.breakTime}h`,
            color: 'text-slate-500 dark:text-slate-400',
          },
          {
            label: 'Personal',
            val: `${data.personalProjects}h`,
            color: 'text-pink-600 dark:text-pink-400',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className={`mt-1 text-xl font-bold ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          Time Allocation Distribution
        </h3>
        <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
          Visual Breakdown of tracked activities across work sessions.
        </p>
        <TimeChart data={data.distribution} />
      </div>
    </div>
  );
};

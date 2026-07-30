import React from 'react';
import { ProductivitySummary } from './productivityService';
import { ProductivityChart } from './ProductivityChart';

interface ProductivityReportPageProps {
  data?: ProductivitySummary;
  isLoading?: boolean;
}

export const ProductivityReportPage: React.FC<ProductivityReportPageProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading || !data) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Overall Score
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {data.score}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/100</span>
          </p>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${data.score}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Completed Tasks
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {data.completedTasks}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {data.pendingTasks} pending tasks remaining
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Completion Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.completionRate}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ratio of total assigned</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Deep Work Focus
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {data.focusHours}h
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {data.deepWorkSessions} focus sessions
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Productivity & Deep Work Trends
        </h3>
        <ProductivityChart data={data.trend} />
      </div>
    </div>
  );
};
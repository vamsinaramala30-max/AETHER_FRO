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
      <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
          ))}
        </div>
        <div className="h-64 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Overall Score
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {data.score}
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              /100
            </span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${data.score}%` }}
            ></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Completion Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.completionRate}%
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ratio of total assigned</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Productivity & Deep Work Trends
        </h3>
        <ProductivityChart data={data.trend} />
      </div>
    </div>
  );
};

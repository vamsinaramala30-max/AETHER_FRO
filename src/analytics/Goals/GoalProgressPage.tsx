import React from 'react';
import { GoalAnalyticsSummary } from './goalAnalyticsService';
import { GoalProgressChart } from './GoalProgressChart';

interface GoalProgressPageProps {
  data?: GoalAnalyticsSummary;
  isLoading?: boolean;
}

export const GoalProgressPage: React.FC<GoalProgressPageProps> = ({ data, isLoading = false }) => {
  if (isLoading || !data) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-48 bg-slate-100 dark:bg-slate-700/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Active Goals
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {data.activeGoals}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Completed Goals
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {data.completedGoals}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Overall Success Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.successRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Goal Completion Velocity
          </h3>
          <GoalProgressChart data={data.progressTrend} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Active Strategic Goals
          </h3>
          <div className="space-y-4">
            {data.goals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {goal.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Target: {goal.targetDate}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {goal.title}
                </h4>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
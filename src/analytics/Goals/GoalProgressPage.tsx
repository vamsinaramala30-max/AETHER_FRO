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
      <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-48 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Active Goals
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {data.activeGoals}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Completed Goals
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {data.completedGoals}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Overall Success Rate
          </p>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.successRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Goal Completion Velocity
          </h3>
          <GoalProgressChart data={data.progressTrend} />
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
            Active Strategic Goals
          </h3>
          <div className="space-y-4">
            {Array.isArray(data.goals) && data.goals.length > 0 ? (
              data.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/60 dark:bg-slate-900/40"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {goal.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Target: {goal.targetDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {goal.title}
                  </h4>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                No active strategic goals recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

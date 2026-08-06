import React from 'react';
import { ProductivityStatsData } from './productivityservice';
import { TrendingUp, CheckCircle, Activity, Cpu } from 'lucide-react';

interface ProductivityStatsProps {
  stats: ProductivityStatsData;
}

export const ProductivityStats: React.FC<ProductivityStatsProps> = ({ stats }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Stat block 1 */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Focus Duration
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.focusTimeToday} <span className="text-sm font-normal text-slate-500">mins</span>
          </h3>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <span>+{String(stats.weeklyComparison)}% vs last week</span>
        </div>
      </div>

      {/* Stat block 2 */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tasks Executed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.tasksCompleted} <span className="text-sm font-normal text-slate-500">units</span>
          </h3>
        </div>
        <div className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          Daily workspace milestone hit
        </div>
      </div>

      {/* Stat block 3 */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Efficiency Index
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.efficiencyScore}%
          </h3>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-400"
            style={{ width: `${String(stats.efficiencyScore)}%` }}
          />
        </div>
      </div>

      {/* Stat block 4 */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Architecture Context
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <h3 className="mt-2 truncate text-base font-medium text-slate-900 dark:text-slate-200">
            AETHER Master Node
          </h3>
        </div>
        <div className="mt-3 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
          Engine: Stable | Threads: Active
        </div>
      </div>
    </div>
  );
};

// frontend/src/workspace/productivity-hub/ProductivityStats.tsx
import React from 'react';
import { ProductivityStatsData } from './productivityservice';

interface ProductivityStatsProps {
  stats: ProductivityStatsData;
}

export const ProductivityStats: React.FC<ProductivityStatsProps> = ({ stats }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Stat block 1 */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 shadow-sm backdrop-blur-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Focus Duration
          </span>
          <h3 className="mt-1.5 font-mono text-2xl font-bold text-white">
            {stats.focusTimeToday} <span className="text-sm font-normal text-slate-500">mins</span>
          </h3>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span>+{String(stats.weeklyComparison)}% vs last week</span>
        </div>
      </div>

      {/* Stat block 2 */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 shadow-sm backdrop-blur-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tasks Executed
          </span>
          <h3 className="mt-1.5 font-mono text-2xl font-bold text-white">
            {stats.tasksCompleted} <span className="text-sm font-normal text-slate-500">units</span>
          </h3>
        </div>
        <div className="mt-3 text-xs font-medium text-slate-400">Daily workspace milestone hit</div>
      </div>

      {/* Stat block 3 */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 shadow-sm backdrop-blur-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Efficiency Index
          </span>
          <h3 className="mt-1.5 font-mono text-2xl font-bold text-white">
            {stats.efficiencyScore}%
          </h3>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${String(stats.efficiencyScore)}%` }}
          />
        </div>
      </div>

      {/* Stat block 4 */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 shadow-sm backdrop-blur-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Architecture Context
          </span>
          <h3 className="mt-2 truncate text-base font-medium text-slate-200">AETHER Master Node</h3>
        </div>
        <div className="mt-3 truncate font-mono text-[11px] text-slate-500">
          Engine: Stable | Threads: Active
        </div>
      </div>
    </div>
  );
};

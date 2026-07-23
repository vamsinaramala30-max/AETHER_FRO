// frontend/src/workspace/productivity-hub/ProductivityStats.tsx
import React from 'react';
import { ProductivityStatsData } from './productivityService';

interface ProductivityStatsProps {
  stats: ProductivityStatsData;
}

export const ProductivityStats: React.FC<ProductivityStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Stat block 1 */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Focus Duration</span>
          <h3 className="text-2xl font-bold font-mono text-white mt-1.5">{stats.focusTimeToday} <span className="text-sm font-normal text-slate-500">mins</span></h3>
        </div>
        <div className="text-xs text-emerald-400 flex items-center gap-1 mt-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+{stats.weeklyComparison}% vs last week</span>
        </div>
      </div>

      {/* Stat block 2 */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Tasks Executed</span>
          <h3 className="text-2xl font-bold font-mono text-white mt-1.5">{stats.tasksCompleted} <span className="text-sm font-normal text-slate-500">units</span></h3>
        </div>
        <div className="text-xs text-slate-400 mt-3 font-medium">
          Daily workspace milestone hit
        </div>
      </div>

      {/* Stat block 3 */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Efficiency Index</span>
          <h3 className="text-2xl font-bold font-mono text-white mt-1.5">{stats.efficiencyScore}%</h3>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.efficiencyScore}%` }} />
        </div>
      </div>

      {/* Stat block 4 */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Architecture Context</span>
          <h3 className="text-base font-medium text-slate-200 mt-2 truncate">AETHER Master Node</h3>
        </div>
        <div className="text-[11px] font-mono text-slate-500 mt-3 truncate">
          Engine: Stable | Threads: Active
        </div>
      </div>
    </div>
  );
};
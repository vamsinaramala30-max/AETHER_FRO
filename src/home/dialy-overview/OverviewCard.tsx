import React from 'react';
import { OverviewMetric } from './dailyOverviewService';

interface OverviewCardProps {
  metric: OverviewMetric;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ metric }) => {
  const isUp = metric.trend === 'up';
  const isDown = metric.trend === 'down';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 p-4 transition-colors hover:border-slate-600">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {metric.category}
        </span>
        <span className="text-slate-500">{metric.timeframe}</span>
      </div>

      <div className="my-2">
        <div className="text-2xl font-bold text-white">{metric.value}</div>
        <div className="mt-0.5 text-sm font-medium text-slate-300">{metric.title}</div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {isUp && <span className="text-emerald-400">↑ {metric.changePercentage}%</span>}
        {isDown && <span className="text-emerald-400">↓ {Math.abs(metric.changePercentage)}%</span>}
        {!isUp && !isDown && <span className="text-slate-400">— Stable</span>}
      </div>
    </div>
  );
};

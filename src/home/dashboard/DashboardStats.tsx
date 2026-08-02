import React from 'react';

interface MetricItem {
  label: string;
  value: string | number;
  badgeText: string;
  isPositive: boolean;
}

interface DashboardStatsProps {
  totalTasks: number;
  pendingReviews: number;
  systemUptime: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTasks,
  pendingReviews,
  systemUptime,
}) => {
  const metrics: MetricItem[] = [
    { label: 'Tasks in Backlog', value: totalTasks, badgeText: '+4 today', isPositive: true },
    {
      label: 'Reviews Needed',
      value: pendingReviews,
      badgeText: 'Action required',
      isPositive: false,
    },
    { label: 'Cluster Uptime', value: systemUptime, badgeText: '99.99%', isPositive: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((m, idx) => (
        <div key={idx} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-slate-400">{m.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                m.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {m.badgeText}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{m.value}</div>
        </div>
      ))}
    </div>
  );
};

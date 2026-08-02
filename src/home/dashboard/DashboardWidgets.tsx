import React from 'react';

interface QuickStatusItem {
  name: string;
  status: 'Operational' | 'Warning' | 'Degraded';
}

export const DashboardWidgets: React.FC = () => {
  const statuses: QuickStatusItem[] = [
    { name: 'Auth Microservice', status: 'Operational' },
    { name: 'GraphQL Gateway', status: 'Operational' },
    { name: 'Worker Cluster 01', status: 'Warning' },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">Core Infrastructure Status</h3>
      <div className="space-y-2">
        {statuses.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md bg-slate-900/50 p-2 text-xs"
          >
            <span className="font-medium text-slate-300">{item.name}</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                item.status === 'Operational'
                  ? 'bg-emerald-950/40 text-emerald-400'
                  : 'bg-amber-950/40 text-amber-400'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

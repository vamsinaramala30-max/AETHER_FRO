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
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">Core Infrastructure Status</h3>
      <div className="space-y-2">
        {statuses.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-900/50 rounded-md">
            <span className="text-slate-300 font-medium">{item.name}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                item.status === 'Operational'
                  ? 'text-emerald-400 bg-emerald-950/40'
                  : 'text-amber-400 bg-amber-950/40'
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
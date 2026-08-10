import React from 'react';
import { Zap, PlayCircle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { AutomationStatsSummary } from '../../automation-types';

interface Props {
  stats: AutomationStatsSummary;
}

export const AutomationStats: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      title: 'Active Automations',
      value: stats.activeCount,
      subtitle: `${stats.pausedCount} paused`,
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Total Executions',
      value: stats.totalExecutions.toLocaleString(),
      subtitle: 'Last 30 days',
      icon: PlayCircle,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      subtitle: `${stats.failedCount} failures`,
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Est. Time Saved',
      value: `${stats.timeSavedHours} hrs`,
      subtitle: 'Weekly workspace gain',
      icon: Clock,
      color: 'text-sky-500 bg-sky-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.title}</p>
              <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{card.subtitle}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

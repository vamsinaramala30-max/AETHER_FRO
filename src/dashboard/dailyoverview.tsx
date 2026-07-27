import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
        {value}
      </p>
    </div>
    <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">{description}</p>
  </div>
);

interface DailyOverviewProps {
  metrics?: {
    tasksCompleted: number;
    tasksRemaining: number;
    completionRate: number;
    focusHours: number;
  } | null;
  isLoading?: boolean;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  metrics = null,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (metrics === null) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400 dark:border-slate-800">
        Metric stream currently empty.
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Completed Operations"
        value={metrics.tasksCompleted}
        description="Tasks successfully closed today"
      />
      <MetricCard
        title="Active Backlog"
        value={metrics.tasksRemaining}
        description="Tasks awaiting execution context"
      />
      <MetricCard
        title="Throughput Rate"
        value={`${String(metrics.completionRate)}%`}
        description="Ratio of finished over targeted work"
      />
      <MetricCard
        title="Deep Work Context"
        value={`${String(metrics.focusHours)}h`}
        description="High-efficiency continuous blocks"
      />
    </section>
  );
};

export default DailyOverview;

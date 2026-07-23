import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">{value}</p>
    </div>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">{description}</p>
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

export const DailyOverview: React.FC<DailyOverviewProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
        Metric stream currently empty.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
        value={`${metrics.completionRate}%`} 
        description="Ratio of finished over targeted work" 
      />
      <MetricCard 
        title="Deep Work Context" 
        value={`${metrics.focusHours}h`} 
        description="High-efficiency continuous blocks" 
      />
    </section>
  );
};

export default DailyOverview;
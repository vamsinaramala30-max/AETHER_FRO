import React from 'react';

interface AnalyticsHeaderProps {
  title?: string;
  description?: string;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  title = 'Platform Analytics & Intelligence',
  description = 'Real-time overview of your personal productivity, goal velocity, time allocation, and AI optimization strategies.',
}) => {
  return (
    <header className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            {description}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Intelligence Active
          </span>
        </div>
      </div>
    </header>
  );
};
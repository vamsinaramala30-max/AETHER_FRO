import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full animate-pulse space-y-6 bg-transparent p-4 md:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="h-16 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800" />

      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>

      {/* Main Content Layout Block */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / Central Column Blocks */}
        <div className="space-y-6 lg:col-span-2">
          <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Right Sidebar Columns Blocks */}
        <div className="space-y-6">
          <div className="h-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-56 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

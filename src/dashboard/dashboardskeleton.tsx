import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-6 animate-pulse bg-transparent">
      {/* Header Skeleton */}
      <div className="h-16 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      
      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>

      {/* Main Content Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Central Column Blocks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        
        {/* Right Sidebar Columns Blocks */}
        <div className="space-y-6">
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
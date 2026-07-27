import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
      className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-800 rounded-lg" />
          <div className="h-4 w-96 bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-slate-800 rounded-xl" />
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-7 w-20 bg-slate-800 rounded-md" />
            <div className="h-3 w-32 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today Summary */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="h-6 w-40 bg-slate-800 rounded" />
            <div className="h-48 bg-slate-800/40 rounded-xl" />
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="h-6 w-36 bg-slate-800 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-14 bg-slate-800/30 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Productivity Snapshot */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="h-6 w-44 bg-slate-800 rounded" />
            <div className="h-32 bg-slate-800/40 rounded-xl" />
          </div>

          {/* AI Insights */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="h-6 w-32 bg-slate-800 rounded" />
            <div className="h-24 bg-slate-800/40 rounded-xl" />
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="h-6 w-28 bg-slate-800 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-12 bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
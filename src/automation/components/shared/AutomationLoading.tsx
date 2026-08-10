import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AutomationLoading: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

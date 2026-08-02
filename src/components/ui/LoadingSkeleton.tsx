import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-800/60 ${className}`} />
);

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
    <Skeleton className="h-4 w-1/3" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === rows - 1 ? 'w-1/2' : 'w-full'}`} />
    ))}
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-900/30 p-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(count, 4)} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-7 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="space-y-2">
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-16" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, ri) => (
      <div
        key={ri}
        className="grid gap-4 rounded-xl bg-slate-900/20 p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, ci) => (
          <Skeleton key={ci} className={`h-3 ${ci === 0 ? 'w-full' : 'w-3/4'}`} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;

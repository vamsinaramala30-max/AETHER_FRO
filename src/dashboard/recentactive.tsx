import React from 'react';

interface ActivityLog {
  id: string;
  type: 'task' | 'ai' | 'note' | 'document';
  message: string;
  timestamp: string;
  meta?: string;
}

interface RecentActivityProps {
  activities?: ActivityLog[];
  isLoading?: boolean;
  error?: string | null;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  isLoading = false,
  error,
}) => {
  if (isLoading)
    return <div className="h-72 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;

  const hasError = typeof error === 'string' && error.trim() !== '';
  if (hasError) {
    return (
      <div className="rounded-xl border border-rose-300 bg-rose-50/50 p-6 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400">
        Failed to stream execution pipeline events: {error}
      </div>
    );
  }

  const getTypeStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'ai':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-950/60',
          text: 'text-indigo-600 dark:text-indigo-400',
          label: 'AI Node',
        };
      case 'task':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/60',
          text: 'text-emerald-600 dark:text-emerald-400',
          label: 'Engine',
        };
      case 'document':
        return {
          bg: 'bg-cyan-100 dark:bg-cyan-950/60',
          text: 'text-cyan-600 dark:text-cyan-400',
          label: 'Asset',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/60',
          text: 'text-slate-600 dark:text-slate-400',
          label: 'Note',
        };
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Event Stream Pipeline
      </h3>
      {activities.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Workspace historical logs clear.
          </p>
        </div>
      ) : (
        <div className="max-h-[350px] flex-1 space-y-4 overflow-y-auto pr-2">
          {activities.map((act) => {
            const styles = getTypeStyle(act.type);
            const hasMeta = typeof act.meta === 'string' && act.meta.trim() !== '';
            return (
              <div
                key={act.id}
                className="flex items-start gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800/40"
              >
                <span
                  className={`text-2xs rounded-md px-2 py-0.5 font-bold uppercase tracking-widest ${styles.bg} ${styles.text} whitespace-nowrap`}
                >
                  {styles.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    {act.message}
                  </p>
                  {hasMeta && (
                    <span className="text-2xs mt-0.5 block font-mono text-slate-400">
                      {act.meta}
                    </span>
                  )}
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-slate-400 dark:text-slate-500">
                  {act.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;

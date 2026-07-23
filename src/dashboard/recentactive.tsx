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

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [], isLoading, error }) => {
  if (isLoading) return <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-full" />;
  
  if (error) {
    return (
      <div className="p-6 border border-rose-300 dark:border-rose-900 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm">
        Failed to stream execution pipeline events: {error}
      </div>
    );
  }

  const getTypeStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'ai': return { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400', label: 'AI Node' };
      case 'task': return { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400', label: 'Engine' };
      case 'document': return { bg: 'bg-cyan-100 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400', label: 'Asset' };
      default: return { bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-600 dark:text-slate-400', label: 'Note' };
    }
  };

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Event Stream Pipeline</h3>
      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400 dark:text-slate-500">Workspace historical logs clear.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2">
          {activities.map((act) => {
            const styles = getTypeStyle(act.type);
            return (
              <div key={act.id} className="flex gap-4 items-start border-b border-slate-100 dark:border-slate-800/40 pb-3 last:border-0 last:pb-0">
                <span className={`text-2xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${styles.bg} ${styles.text} whitespace-nowrap`}>
                  {styles.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{act.message}</p>
                  {act.meta && <span className="text-2xs font-mono text-slate-400 block mt-0.5">{act.meta}</span>}
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">{act.timestamp}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
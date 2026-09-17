import React from 'react';
import { Calendar, Activity } from 'lucide-react';

export interface DateActivityItem {
  date: string;
  count: number;
}

interface KnowledgeDateGraphProps {
  activityData: DateActivityItem[];
}

export const KnowledgeDateGraph: React.FC<KnowledgeDateGraphProps> = ({ activityData }) => {
  if (!activityData || activityData.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <Activity className="mb-2 h-8 w-8 text-slate-400" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          No knowledge activity yet
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Upload files or create documents and notes to build your knowledge activity timeline.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...activityData.map((d) => d.count), 1);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Knowledge Activity Timeline
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Real Database Timestamps</span>
      </div>

      <div className="flex h-36 items-end justify-between gap-2 px-2 pb-2 pt-4">
        {activityData.slice(-14).map((item, idx) => {
          const heightPercent = Math.max(12, Math.round((item.count / maxCount) * 100));
          return (
            <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
              {/* Tooltip */}
              <div className="absolute -top-8 z-20 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md group-hover:flex dark:bg-slate-800">
                {item.count} activity event(s)
              </div>

              {/* Bar */}
              <div className="flex h-24 w-full max-w-[28px] items-end overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-800/80">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-400"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="max-w-[40px] truncate text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {formatDateLabel(item.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'critical' | 'routine' | 'sync';
}

interface TodaySummaryProps {
  schedule?: ScheduleItem[];
  isLoading?: boolean;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({ schedule = [], isLoading = false }) => {
  if (isLoading) {
    return <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Chronological Agenda
      </h3>
      {schedule.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No events or blocks mapped for the current lifecycle.
          </p>
        </div>
      ) : (
        <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">
          {schedule.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-all hover:bg-slate-100 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800"
            >
              <span className="whitespace-nowrap rounded bg-slate-200 px-2 py-1 font-mono text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {item.time}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.type === 'critical'
                        ? 'bg-rose-500'
                        : item.type === 'sync'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-xs capitalize text-slate-400">{item.type} level</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaySummary;

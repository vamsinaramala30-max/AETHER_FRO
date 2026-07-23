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

export const TodaySummary: React.FC<TodaySummaryProps> = ({ schedule = [], isLoading }) => {
  if (isLoading) {
    return <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-full" />;
  }

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Chronological Agenda</h3>
      {schedule.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400 dark:text-slate-500">No events or blocks mapped for the current lifecycle.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[320px] pr-2">
          {schedule.map((item) => (
            <div 
              key={item.id} 
              className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {item.time}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
                <div className="mt-1 flex gap-2 items-center">
                  <span className={`w-2 h-2 rounded-full ${
                    item.type === 'critical' ? 'bg-rose-500' : item.type === 'sync' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
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
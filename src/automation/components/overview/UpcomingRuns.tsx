import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { AutomationRule } from '../../automation-types';
import { formatScheduleText } from '../../automation-utils';

interface Props {
  automations: AutomationRule[];
}

export const UpcomingRuns: React.FC<Props> = ({ automations }) => {
  const scheduledList = automations.filter((a) => a.status === 'active' && a.schedule);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Runs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Next scheduled background executions
          </p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          {scheduledList.length} Scheduled
        </span>
      </div>

      {scheduledList.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No scheduled automations active.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {scheduledList.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 first:pt-4 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatScheduleText(item.schedule)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Scheduled</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

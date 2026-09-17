import React from 'react';
import { Zap, Play, ChevronRight } from 'lucide-react';
import { AutomationRule } from '../../automation-types';
import { formatScheduleText, formatRelativeTime } from '../../automation-utils';
import { Button } from '@/components/ui/button';

interface Props {
  automations: AutomationRule[];
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onNavigateToAll: () => void;
}

export const ActiveAutomations: React.FC<Props> = ({
  automations,
  onToggleStatus,
  onRunNow,
  onNavigateToAll,
}) => {
  const activeList = automations.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Automations</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Currently running operational schedules & triggers
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToAll}
          className="text-amber-600 dark:text-amber-400"
        >
          View all
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {activeList.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No active automations configured yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activeList.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 first:pt-4 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatScheduleText(item.schedule)} • Last run:{' '}
                    {formatRelativeTime(item.lastRunAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRunNow(item.id)}
                  title="Run now"
                  className="h-8 w-8 p-0 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <button
                  onClick={() => onToggleStatus(item)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.status === 'active' ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      item.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

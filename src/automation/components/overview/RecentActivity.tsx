import React from 'react';
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { ExecutionLog } from '../../automation-types';
import { formatRelativeTime } from '../../automation-utils';
import { Button } from '@/components/ui/button';

interface Props {
  logs: ExecutionLog[];
  onNavigateToActivity: () => void;
}

export const RecentActivity: React.FC<Props> = ({ logs, onNavigateToActivity }) => {
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity Feed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live execution history of automated background tasks</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onNavigateToActivity} className="text-amber-600 dark:text-amber-400">
          View activity log
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {recentLogs.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No recent execution activity.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-3.5 first:pt-4 last:pb-0">
              <div className="flex items-center gap-3">
                {log.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : log.status === 'failed' ? (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                ) : (
                  <Clock className="h-5 w-5 shrink-0 text-amber-500" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{log.automationName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Triggered by {log.trigger} • Duration: {log.duration || '850ms'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{formatRelativeTime(log.startedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

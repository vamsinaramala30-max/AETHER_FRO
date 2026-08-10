import React from 'react';
import { ExecutionLog } from '../../automation-types';
import { ExecutionStatusBadge } from './ExecutionStatus';
import { formatRelativeTime } from '../../automation-utils';
import { ChevronRight } from 'lucide-react';

interface Props {
  log: ExecutionLog;
  onSelect: (log: ExecutionLog) => void;
}

export const ActivityItem: React.FC<Props> = ({ log, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(log)}
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-amber-500/40 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-3.5">
        <ExecutionStatusBadge status={log.status} />
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
            {log.automationName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Trigger: {log.trigger} • Duration: {log.duration || '920ms'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">{formatRelativeTime(log.startedAt)}</span>
        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
};

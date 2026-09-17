import React from 'react';
import { ExecutionStatus } from '../../automation-types';
import { DateRangeOption } from '../../hooks/useAutomationActivity';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Props {
  statusFilter: 'ALL' | ExecutionStatus;
  onStatusChange: (status: 'ALL' | ExecutionStatus) => void;
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ActivityFilters: React.FC<Props> = ({
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange,
}) => {
  const statuses: Array<{ id: 'ALL' | ExecutionStatus; label: string }> = [
    { id: 'ALL', label: 'All Executions' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
    { id: 'running', label: 'Running' },
    { id: 'needs_attention', label: 'Needs Attention' },
  ];

  const dateRanges: Array<{ id: DateRangeOption; label: string }> = [
    { id: 'ALL', label: 'All Time' },
    { id: 'TODAY', label: 'Today' },
    { id: 'YESTERDAY', label: 'Yesterday' },
    { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter activity history by automation or trigger..."
            className="border-slate-200/80 bg-white pl-10 dark:border-slate-800 dark:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {statuses.map((s) => {
            const isActive = statusFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onStatusChange(s.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200/40 pt-1 text-xs dark:border-slate-800/40">
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Calendar className="h-3 w-3" />
          Time Window:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {dateRanges.map((d) => {
            const isActive = dateRange === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onDateRangeChange(d.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'border border-amber-500/30 bg-amber-500/10 font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

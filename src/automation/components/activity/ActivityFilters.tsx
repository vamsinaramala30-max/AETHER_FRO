import React from 'react';
import { ExecutionStatus } from '../../automation-types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Props {
  statusFilter: 'ALL' | ExecutionStatus;
  onStatusChange: (status: 'ALL' | ExecutionStatus) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ActivityFilters: React.FC<Props> = ({
  statusFilter,
  onStatusChange,
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter activity history by automation or trigger..."
          className="pl-10 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
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
  );
};

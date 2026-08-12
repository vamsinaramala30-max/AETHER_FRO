import React, { useState } from 'react';
import { ExecutionLog } from '../automation-types';
import { useAutomationActivity } from '../hooks/useAutomationActivity';
import { ActivityList } from '../components/activity/ActivityList';
import { ActivityFilters } from '../components/activity/ActivityFilters';
import { ExecutionDetails } from '../components/activity/ExecutionDetails';

export const AutomationActivity: React.FC = () => {
  const {
    logs,
    isLoading,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
  } = useAutomationActivity();

  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ActivityFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ActivityList logs={logs} isLoading={isLoading} onSelectLog={setSelectedLog} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-800 text-xs">
          <span className="text-slate-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ExecutionDetails
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

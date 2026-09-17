import { useState, useEffect, useCallback } from 'react';
import { ExecutionLog, ExecutionStatus } from '../automation-types';
import { automationExecutionService } from '../services/automation-execution-service';

export type DateRangeOption = 'ALL' | 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';

export function useAutomationActivity() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ExecutionStatus>('ALL');
  const [dateRange, setDateRange] = useState<DateRangeOption>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await automationExecutionService.fetchLogs({
        search: searchQuery,
        status: statusFilter,
        page,
        limit: 50,
      });

      let filtered = res.logs;

      if (dateRange !== 'ALL') {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

        filtered = filtered.filter((log) => {
          const logDate = new Date(log.startedAt);
          if (dateRange === 'TODAY') return logDate >= startOfToday;
          if (dateRange === 'YESTERDAY')
            return logDate >= startOfYesterday && logDate < startOfToday;
          if (dateRange === 'LAST_7_DAYS') return logDate >= sevenDaysAgo;
          if (dateRange === 'LAST_30_DAYS') return logDate >= thirtyDaysAgo;
          return true;
        });
      }

      setLogs(filtered);
      setTotalPages(res.totalPages);
      setTotal(filtered.length);
    } catch (err: any) {
      setError(err?.message || 'Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, dateRange, page]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    logs,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    total,
    refreshActivity: fetchActivity,
  };
}

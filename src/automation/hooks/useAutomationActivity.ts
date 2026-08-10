import { useState, useEffect, useCallback } from 'react';
import { ExecutionLog, ExecutionStatus } from '../automation-types';
import { automationExecutionService } from '../services/automation-execution-service';

export function useAutomationActivity() {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ExecutionStatus>('ALL');
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
        limit: 20,
      });
      setLogs(res.logs);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: any) {
      setError(err?.message || 'Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, page]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    logs,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    total,
    refreshActivity: fetchActivity,
  };
}

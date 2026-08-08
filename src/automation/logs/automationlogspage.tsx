import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/api/client';

interface AutomationLog {
  id: string;
  timestamp: string;
  automationName: string;
  trigger: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  duration: string;
  executedBy: string;
  errorMessage?: string | null;
}

export const AutomationLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiClient.get<any>('/automations/logs', {
        params: {
          search,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          page,
          limit: 10,
        },
      });
      const payload = res.data || res;
      if (payload && Array.isArray(payload.logs)) {
        setLogs(payload.logs);
        if (payload.pagination) {
          setTotalPages(payload.pagination.totalPages || 1);
        }
      } else if (Array.isArray(payload)) {
        setLogs(payload);
      } else {
        setLogs([]);
      }
    } catch (err: any) {
      console.error('[AutomationLogsPage] API request failed:', err);
      setErrorMsg(
        err?.message || 'Failed to pull automation execution logs from production server.',
      );
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      'Timestamp',
      'Automation Name',
      'Trigger',
      'Status',
      'Duration',
      'Executed By',
      'Error Message',
    ];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.automationName}"`,
      `"${l.trigger}"`,
      `"${l.status}"`,
      `"${l.duration}"`,
      `"${l.executedBy}"`,
      `"${l.errorMessage || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `automation_execution_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 shrink-0 text-amber-500 dark:text-amber-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Automation Execution Logs
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Audit isolated workflow triggers, runtime durations, status codes, and execution
              errors.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <Download className="h-4 w-4" />
          Export CSV Logs
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs by automation name, trigger, or executor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-900">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="FAILED">Failed Only</option>
            </select>
          </div>

          <button
            onClick={() => void fetchLogs()}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
            title="Refresh Logs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex h-48 w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
          <Zap className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No automation logs found
          </p>
          <p className="text-xs text-slate-400">
            All workflow execution events will record here in real-time.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Automation Name</th>
                <th className="px-5 py-3 font-semibold">Trigger</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Executed By</th>
                <th className="px-5 py-3 font-semibold">Error Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">
                    {log.automationName}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-600 dark:text-slate-300">
                    {log.trigger}
                  </td>
                  <td className="px-5 py-3">
                    {log.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" /> FAILED
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{log.duration}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{log.executedBy}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {log.errorMessage ? (
                      <span
                        className="block max-w-[200px] truncate font-mono text-[11px] text-red-500 dark:text-red-400"
                        title={log.errorMessage}
                      >
                        {log.errorMessage}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

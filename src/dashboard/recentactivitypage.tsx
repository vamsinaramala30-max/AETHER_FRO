import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  GitCommit,
  CheckCircle,
  FileText,
  MessageSquare,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/api/client';

interface ActivityEntry {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getActivityIcon(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes('commit') || lower.includes('push'))
    return <GitCommit className="h-4 w-4 text-purple-500" />;
  if (lower.includes('complete') || lower.includes('done'))
    return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  if (lower.includes('file') || lower.includes('upload') || lower.includes('document'))
    return <FileText className="h-4 w-4 text-blue-500" />;
  if (lower.includes('ai') || lower.includes('chat') || lower.includes('message'))
    return <MessageSquare className="h-4 w-4 text-indigo-500" />;
  if (lower.includes('auto') || lower.includes('workflow'))
    return <Zap className="h-4 w-4 text-amber-500" />;
  return <Activity className="h-4 w-4 text-slate-400" />;
}

export const RecentActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>('/dashboard');
      const data = res.data?.data || res.data || {};
      const rawActivity: ActivityEntry[] = Array.isArray(data.activity) ? data.activity : [];
      setActivities(rawActivity);
    } catch {
      setError('Could not load activity log. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          Recent Activity Log
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time audit log of workspace events, updates, and contributions.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent dark:border-purple-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Loading activity...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Activity className="mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No activity logged yet
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Actions and updates performed in your workspace will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  {getActivityIcon(entry.action)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {entry.action}
                  </p>
                  {entry.entityType && (
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {entry.entityType}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {timeAgo(entry.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

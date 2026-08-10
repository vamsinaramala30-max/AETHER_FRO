import { AutomationStatus, ExecutionStatus, TriggerType } from './automation-types';

export function formatScheduleText(schedule?: string | null): string {
  if (!schedule) return 'On event trigger';
  if (schedule === '0 8 * * 1-5') return 'Every weekday at 8:00 AM';
  if (schedule === '30 7 * * *') return 'Everyday at 7:30 AM';
  if (schedule === '0 16 * * 5') return 'Fridays at 4:00 PM';
  if (schedule === '0 * * * *') return 'Hourly';
  if (schedule.includes('*')) return `Cron (${schedule})`;
  return schedule;
}

export function formatTriggerLabel(trigger: TriggerType | string): string {
  const map: Record<string, string> = {
    SCHEDULE: 'Schedule / Cron',
    CALENDAR_EVENT: 'Calendar Event',
    TASK_CREATED: 'Task Created',
    TASK_COMPLETED: 'Task Completed',
    TASK_OVERDUE: 'Task Overdue',
    PROJECT_CREATED: 'Project Created',
    PROJECT_UPDATED: 'Project Updated',
    GOAL_UPDATED: 'Goal Updated',
    DOCUMENT_CREATED: 'Document Created',
    DOCUMENT_UPDATED: 'Document Updated',
    FILE_UPLOADED: 'File Uploaded',
    AI_EVENT: 'AI Directive Signal',
    AGENT_EVENT: 'Agent Signal',
    MANUAL: 'Manual Trigger',
  };
  return map[trigger] || trigger;
}

export function getStatusBadgeStyle(status: AutomationStatus): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        color: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
      };
    case 'paused':
      return {
        label: 'Paused',
        color: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
      };
    case 'draft':
      return {
        label: 'Draft',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
      };
    case 'failed':
      return {
        label: 'Failed',
        color: 'text-rose-700 dark:text-rose-300',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
      };
    default:
      return {
        label: status,
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
      };
  }
}

export function getExecutionBadgeStyle(status: ExecutionStatus): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case 'running':
      return {
        label: 'Running',
        color: 'text-sky-700 dark:text-sky-300',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/30',
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
      };
    case 'failed':
      return {
        label: 'Failed',
        color: 'text-rose-700 dark:text-rose-300',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
      };
    case 'needs_attention':
      return {
        label: 'Needs Attention',
        color: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
      };
    default:
      return {
        label: status,
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
      };
  }
}

export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

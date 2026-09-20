// ============================================================================
// AETHER AI — ToolExecution Component
// ============================================================================
// Displays safe tool execution status. Never shows private tool results.
// ============================================================================

import React, { memo } from 'react';
import type { ToolInvocationRef } from '../ai-types';

interface ToolExecutionProps {
  toolInvocations: ToolInvocationRef[];
  className?: string;
}

const STATUS_CONFIG: Record<
  ToolInvocationRef['status'],
  { label: string; icon: string; colorClass: string; badgeClass: string }
> = {
  pending: {
    label: 'Pending',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  PLANNED: {
    label: 'Planned',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  REQUESTED: {
    label: 'Requested',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  VALIDATING: {
    label: 'Validating…',
    icon: '◎',
    colorClass: 'text-cyan-400 animate-pulse',
    badgeClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  },
  AUTHORIZED: {
    label: 'Authorized',
    icon: '✓',
    colorClass: 'text-indigo-400',
    badgeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  },
  executing: {
    label: 'Executing…',
    icon: '◐',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  EXECUTING: {
    label: 'Executing…',
    icon: '◐',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  VERIFYING: {
    label: 'Verifying State…',
    icon: '🔍',
    colorClass: 'text-sky-400 animate-pulse',
    badgeClass: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  },
  completed: {
    label: 'Completed & Verified',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  COMPLETED: {
    label: 'Completed & Verified',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  failed: {
    label: 'Failed',
    icon: '✗',
    colorClass: 'text-rose-400',
    badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  },
  FAILED: {
    label: 'Failed',
    icon: '✗',
    colorClass: 'text-rose-400',
    badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  },
  TIMED_OUT: {
    label: 'Timed Out',
    icon: '⏱',
    colorClass: 'text-orange-400',
    badgeClass: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  },
  DENIED: {
    label: 'Denied / Unauthorized',
    icon: '⛔',
    colorClass: 'text-red-400',
    badgeClass: 'border-red-500/30 bg-red-500/10 text-red-300',
  },
  READY: {
    label: 'Ready',
    icon: '⚡',
    colorClass: 'text-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  BLOCKED: {
    label: 'Blocked',
    icon: '⛔',
    colorClass: 'text-amber-400',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  NEEDS_CLARIFICATION: {
    label: 'Needs Clarification',
    icon: '❓',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  SKIPPED: {
    label: 'Skipped',
    icon: '↷',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '⊘',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: '⊘',
    colorClass: 'text-aether-muted',
    badgeClass: 'border-aether-border bg-aether-subtle text-aether-muted',
  },
  EXECUTED: {
    label: 'Executed',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  SUCCESS: {
    label: 'Success',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
};

/**
 * ToolExecution — Displays safe tool execution status from backend results.
 * Does NOT expose arbitrary tool output or private execution details.
 */
export const ToolExecution = memo<ToolExecutionProps>(({ toolInvocations, className = '' }) => {
  if (!toolInvocations || toolInvocations.length === 0) return null;

  return (
    <section
      className={`mt-3 space-y-2 rounded-2xl border border-aether-border bg-aether-surface p-3.5 backdrop-blur-sm ${className}`}
      aria-label="Tool executions"
    >
      <header className="flex items-center justify-between border-b border-aether-border pb-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-aether-muted">
          Tools Executed ({toolInvocations.length})
        </h3>
      </header>

      <div className="space-y-2 pt-1">
        {toolInvocations.map((inv) => {
          const config = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG.pending;
          const duration =
            inv.startedAt && inv.completedAt
              ? `${Math.max(1, Math.round(inv.completedAt - inv.startedAt))}ms`
              : undefined;

          return (
            <div
              key={inv.id}
              className="flex items-start gap-2.5 rounded-xl border border-aether-border bg-aether-subtle p-2.5"
              role="status"
              aria-label={`${inv.toolName}: ${config.label}`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center font-mono text-xs font-bold ${config.colorClass}`}
                aria-hidden="true"
              >
                {config.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-mono text-xs font-semibold text-aether-main">
                    {inv.toolName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {duration && (
                      <span className="text-[10px] text-aether-muted font-mono">
                        {duration}
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-medium ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>

                {inv.verified && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                    <span>✓</span>
                    <span>Backend Verified</span>
                  </div>
                )}

                {inv.status === 'failed' && inv.error && (
                  <p className="mt-1 text-[11px] text-rose-400">{inv.error}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

ToolExecution.displayName = 'ToolExecution';

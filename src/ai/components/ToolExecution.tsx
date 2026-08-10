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
  { label: string; icon: string; colorClass: string }
> = {
  pending: { label: 'Pending', icon: '○', colorClass: 'text-slate-400' },
  executing: { label: 'Executing…', icon: '◐', colorClass: 'text-amber-400 animate-pulse' },
  completed: { label: 'Completed', icon: '✓', colorClass: 'text-emerald-400' },
  failed: { label: 'Failed', icon: '✗', colorClass: 'text-red-400' },
};

/**
 * ToolExecution — Displays safe tool execution status from backend results.
 * Does NOT expose arbitrary tool output or private execution details.
 */
export const ToolExecution = memo<ToolExecutionProps>(({ toolInvocations, className = '' }) => {
  if (!toolInvocations || toolInvocations.length === 0) return null;

  return (
    <section
      className={`mt-3 space-y-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 p-3 ${className}`}
      aria-label="Tool executions"
    >
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Tools Used
      </h3>
      {toolInvocations.map((inv) => {
        const config = STATUS_CONFIG[inv.status];
        return (
          <div
            key={inv.id}
            className="flex items-start gap-2"
            role="status"
            aria-label={`${inv.toolName}: ${config.label}`}
          >
            <span
              className={`mt-0.5 w-4 shrink-0 text-center text-xs font-bold ${config.colorClass}`}
              aria-hidden="true"
            >
              {config.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-300">{inv.toolName}</p>
              <p className={`text-[11px] ${config.colorClass}`}>{config.label}</p>
              {inv.status === 'failed' && inv.error && (
                <p className="mt-0.5 text-[11px] text-red-400">{inv.error}</p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
});

ToolExecution.displayName = 'ToolExecution';

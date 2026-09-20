// ============================================================================
// AETHER AI — PlanView Component
// ============================================================================
// Displays structured multi-step execution plans, Prompt 7 reasoning metadata,
// and verified backend progress.
// ============================================================================

import React, { memo } from 'react';
import type { ActionPlanRef, PlanStepRef } from '../ai-types';

interface PlanViewProps {
  plan: ActionPlanRef;
  className?: string;
}

const STEP_STATUS_CONFIG: Record<
  PlanStepRef['status'],
  { label: string; icon: string; colorClass: string; badgeClass: string }
> = {
  pending: {
    label: 'Pending',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  PLANNED: {
    label: 'Planned',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  REQUESTED: {
    label: 'Requested',
    icon: '○',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  VALIDATING: {
    label: 'Validating…',
    icon: '◎',
    colorClass: 'text-cyan-400 animate-pulse',
    badgeClass: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50',
  },
  READY: {
    label: 'Ready',
    icon: '⚡',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
  },
  BLOCKED: {
    label: 'Blocked',
    icon: '⛔',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  },
  NEEDS_CLARIFICATION: {
    label: 'Needs Clarification',
    icon: '❓',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  },
  SKIPPED: {
    label: 'Skipped',
    icon: '↷',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  AUTHORIZED: {
    label: 'Authorized',
    icon: '✓',
    colorClass: 'text-indigo-400',
    badgeClass: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/50',
  },
  executing: {
    label: 'Executing…',
    icon: '◐',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  },
  EXECUTING: {
    label: 'Executing…',
    icon: '◐',
    colorClass: 'text-amber-400 animate-pulse',
    badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  },
  VERIFYING: {
    label: 'Verifying State…',
    icon: '🔍',
    colorClass: 'text-sky-400 animate-pulse',
    badgeClass: 'bg-sky-950/40 text-sky-300 border-sky-800/50',
  },
  completed: {
    label: 'Completed & Verified',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
  },
  COMPLETED: {
    label: 'Completed & Verified',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
  },
  failed: {
    label: 'Failed',
    icon: '✗',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
  },
  FAILED: {
    label: 'Failed',
    icon: '✗',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
  },
  TIMED_OUT: {
    label: 'Timed Out',
    icon: '⏱',
    colorClass: 'text-orange-400',
    badgeClass: 'bg-orange-950/40 text-orange-300 border-orange-800/50',
  },
  DENIED: {
    label: 'Denied / Unauthorized',
    icon: '⛔',
    colorClass: 'text-red-400',
    badgeClass: 'bg-red-950/40 text-red-300 border-red-800/50',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '⊘',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: '⊘',
    colorClass: 'text-aether-muted',
    badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
  },
  EXECUTED: {
    label: 'Executed',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
  },
  SUCCESS: {
    label: 'Success',
    icon: '✓',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
  },
};

export const PlanView: React.FC<PlanViewProps> = memo(({ plan, className = '' }) => {
  if (!plan || !plan.steps || plan.steps.length === 0) return null;

  const isSuccess = plan.status === 'SUCCESS';
  const isPartial = plan.status === 'PARTIAL_SUCCESS';
  const isFailed = plan.status === 'FAILED';
  const isReady = plan.status === 'READY';
  const isHandedOff = plan.status === 'HANDED_OFF';
  const isNeedsClarification = plan.status === 'NEEDS_CLARIFICATION';
  const isBlocked = plan.status === 'BLOCKED';
  const isValidating = plan.status === 'VALIDATING';
  const isPlanning = plan.status === 'PLANNING' || plan.status === 'UNDERSTANDING';

  let statusBadgeClass = 'border-blue-500/30 bg-blue-500/10 text-blue-400';
  if (isSuccess || isReady) {
    statusBadgeClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  } else if (isHandedOff) {
    statusBadgeClass = 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
  } else if (isPartial || isNeedsClarification) {
    statusBadgeClass = 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  } else if (isFailed || isBlocked) {
    statusBadgeClass = 'border-rose-500/30 bg-rose-500/10 text-rose-400';
  } else if (isValidating || isPlanning) {
    statusBadgeClass = 'border-purple-500/30 bg-purple-500/10 text-purple-300';
  }

  return (
    <section
      className={`mt-3 rounded-2xl border border-aether-border bg-aether-surface p-4 backdrop-blur-md ${className}`}
      aria-label="Multi-step Action Plan"
    >
      <div className="mb-3 flex items-center justify-between border-b border-aether-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-400">
            ⚡
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-aether-main">
              Agent Plan
            </h3>
            {plan.version && plan.version > 1 && (
              <span className="rounded bg-indigo-950/60 px-1.5 py-0.2 font-mono text-[9px] text-indigo-300 border border-indigo-800/40">
                v{plan.version}
              </span>
            )}
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeClass}`}
        >
          {plan.status.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="mb-3 text-xs font-medium italic text-aether-muted">"{plan.objective}"</p>

      {/* Clarification Request Card */}
      {plan.clarificationRequest && (
        <div className="mb-3 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
            <span>❓</span>
            <span>Clarification Needed:</span>
          </div>
          <p className="text-aether-main mb-2">{plan.clarificationRequest.question}</p>
          {plan.clarificationRequest.missingInfo && plan.clarificationRequest.missingInfo.length > 0 && (
            <div className="text-[11px] text-amber-300/80 mb-2">
              <span className="font-medium">Missing: </span>
              {plan.clarificationRequest.missingInfo.join(', ')}
            </div>
          )}
          {plan.clarificationRequest.suggestedAnswers && plan.clarificationRequest.suggestedAnswers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {plan.clarificationRequest.suggestedAnswers.map((suggestion, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-amber-500/30 bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-200"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Constraints & Assumptions Badges */}
      {plan.constraints && plan.constraints.length > 0 && (
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-aether-muted">
            Constraints:
          </span>
          {plan.constraints.map((c, i) => (
            <span
              key={i}
              className="rounded bg-aether-subtle border border-aether-border px-1.5 py-0.5 text-[10px] text-aether-muted"
            >
              🛡️ {c}
            </span>
          ))}
        </div>
      )}

      {/* Plan Steps List */}
      <div className="space-y-2">
        {plan.steps.map((step) => {
          const config = STEP_STATUS_CONFIG[step.status] || {
            label: step.status,
            icon: '○',
            colorClass: 'text-aether-muted',
            badgeClass: 'bg-aether-subtle text-aether-muted border-aether-border',
          };
          return (
            <div
              key={step.stepId}
              className="flex items-start gap-2.5 rounded-xl border border-aether-border bg-aether-subtle p-2.5 transition-colors"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${config.colorClass}`}
                aria-hidden="true"
              >
                {config.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-aether-main">
                    <span className="mr-1.5 font-mono text-aether-muted">#{step.stepNumber}</span>
                    {step.description}
                  </p>
                  {step.toolName && (
                    <span className="shrink-0 rounded bg-aether-subtle px-1.5 py-0.5 font-mono text-[10px] text-aether-muted border border-aether-border">
                      🔧 {step.toolName}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`py-0.2 inline-block rounded border px-1.5 text-[9px] font-medium ${config.badgeClass}`}
                  >
                    {config.label}
                  </span>

                  {step.requiresConfirmation && (
                    <span className="rounded bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.2 text-[9px] font-medium text-amber-300">
                      ⚠️ Needs Confirmation
                    </span>
                  )}

                  {step.dependencies && step.dependencies.length > 0 && (
                    <span className="text-[10px] text-aether-muted font-mono">
                      ↳ Depends on: {step.dependencies.join(', ')}
                    </span>
                  )}

                  {step.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                      <span>✓</span> Backend Verified
                    </span>
                  )}

                  {step.verificationDetails && (
                    <span className="text-[10px] text-aether-muted font-mono">
                      · {step.verificationDetails}
                    </span>
                  )}

                  {step.status === 'failed' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-rose-400">
                      <span>✗</span> {step.error || 'Failed'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {plan.summary && (
        <div className="mt-3 rounded-xl border border-aether-border bg-aether-subtle p-2.5 text-xs text-aether-muted">
          <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-aether-muted">
            Plan Summary:
          </span>
          <p>{plan.summary}</p>
        </div>
      )}

      {/* Plan Integrity Hash */}
      {plan.planHash && (
        <div className="mt-2.5 flex items-center justify-end">
          <span className="font-mono text-[9px] text-aether-muted">
            SHA-256: {plan.planHash.substring(0, 16)}…
          </span>
        </div>
      )}
    </section>
  );
});

PlanView.displayName = 'PlanView';

// ============================================================================
// AETHER AI — AIThinking Component
// ============================================================================
// Shows safe public-facing thinking status only.
// Never exposes private chain-of-thought.
// ============================================================================

import React, { memo } from 'react';
import type { ThinkingState, ThinkingStatus } from '../ai-types';

interface AIThinkingProps {
  state: ThinkingState | null;
  className?: string;
}

const STATUS_THEME: Record<
  ThinkingStatus,
  {
    bg: string;
    border: string;
    text: string;
    dotColor: string;
    badgeText?: string;
  }
> = {
  idle: {
    bg: 'bg-transparent',
    border: 'border-transparent',
    text: 'text-aether-muted',
    dotColor: 'bg-aether-muted',
  },
  analyzing: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-300',
    dotColor: 'bg-indigo-400',
    badgeText: 'Analyzing',
  },
  retrieving: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-300',
    dotColor: 'bg-cyan-400',
    badgeText: 'Context',
  },
  planning: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-300',
    dotColor: 'bg-blue-400',
    badgeText: 'Planning',
  },
  waiting_confirmation: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-300',
    dotColor: 'bg-amber-400',
    badgeText: 'Confirming',
  },
  executing_action: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-500/20',
    text: 'text-purple-600 dark:text-purple-300',
    dotColor: 'bg-purple-400',
    badgeText: 'Executing',
  },
  verifying: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-300',
    dotColor: 'bg-emerald-400',
    badgeText: 'Verifying',
  },
  generating: {
    bg: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-300',
    dotColor: 'bg-indigo-400',
    badgeText: 'Responding',
  },
  thinking: {
    bg: 'bg-aether-subtle dark:bg-slate-900/60',
    border: 'border-aether-border dark:border-slate-700/40',
    text: 'text-aether-muted dark:text-slate-300',
    dotColor: 'bg-aether-muted',
    badgeText: 'Reasoning',
  },
  using_tool: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-500/20',
    text: 'text-purple-600 dark:text-purple-300',
    dotColor: 'bg-purple-400',
    badgeText: 'Tool',
  },
};

/**
 * AIThinking — Displays a safe, animated thinking indicator reflecting actual AI state.
 * Only shows public-facing status labels. No internal reasoning is exposed.
 */
export const AIThinking = memo<AIThinkingProps>(({ state, className = '' }) => {
  if (!state || state.status === 'idle') return null;

  const theme = STATUS_THEME[state.status] ?? STATUS_THEME.thinking;

  return (
    <div
      className={`my-2 inline-flex max-w-full items-center gap-2.5 rounded-xl border px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-200 ${theme.bg} ${theme.border} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={state.label}
    >
      {/* Animated pulsing dot cluster */}
      <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
        <span
          className={`h-1.5 w-1.5 animate-bounce rounded-full ${theme.dotColor}`}
          style={{ animationDelay: '0ms' }}
        />
        <span
          className={`h-1.5 w-1.5 animate-bounce rounded-full ${theme.dotColor}`}
          style={{ animationDelay: '150ms' }}
        />
        <span
          className={`h-1.5 w-1.5 animate-bounce rounded-full ${theme.dotColor}`}
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* Stage Badge */}
      {theme.badgeText && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${theme.text} bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shrink-0`}
        >
          {theme.badgeText}
        </span>
      )}

      {/* Primary Status Label */}
      <span className={`truncate text-xs font-medium ${theme.text}`}>
        {state.label}
      </span>

      {/* Step counter if available */}
      {state.step !== undefined && state.totalSteps !== undefined && (
        <span className="ml-auto text-[10px] text-aether-muted font-mono shrink-0">
          [{state.step}/{state.totalSteps}]
        </span>
      )}
    </div>
  );
});

AIThinking.displayName = 'AIThinking';

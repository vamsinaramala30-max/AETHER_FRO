// ============================================================================
// AETHER AI — AIThinking Component
// ============================================================================
// Shows safe public-facing thinking status only.
// Never exposes private chain-of-thought.
// ============================================================================

import React, { memo } from 'react';
import type { ThinkingState } from '../ai-types';

interface AIThinkingProps {
  state: ThinkingState | null;
  className?: string;
}

/**
 * AIThinking — Displays a safe, animated thinking indicator.
 * Only shows public-facing status labels. No internal reasoning is exposed.
 */
export const AIThinking = memo<AIThinkingProps>(({ state, className = '' }) => {
  if (!state || state.status === 'idle') return null;

  return (
    <div
      className={`flex items-center gap-2 py-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={state.label}
    >
      {/* Animated dots */}
      <div className="flex items-center gap-1" aria-hidden="true">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-xs text-slate-400">{state.label}</span>
    </div>
  );
});

AIThinking.displayName = 'AIThinking';

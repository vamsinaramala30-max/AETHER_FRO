// ============================================================================
// AETHER AI — AIStatus Component
// ============================================================================

import React, { memo } from 'react';
import type { AIConnectionStatus, StreamingStatus } from '../ai-types';

interface AIStatusProps {
  connectionStatus: AIConnectionStatus;
  streamingStatus?: StreamingStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  AIConnectionStatus,
  { label: string; dotColor: string; textColor: string; animate: boolean }
> = {
  connected: { label: 'Connected', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', animate: false },
  connecting: { label: 'Connecting…', dotColor: 'bg-amber-400', textColor: 'text-amber-400', animate: true },
  unavailable: { label: 'Unavailable', dotColor: 'bg-slate-400', textColor: 'text-slate-400', animate: false },
  error: { label: 'Error', dotColor: 'bg-red-400', textColor: 'text-red-400', animate: false },
  generating: { label: 'Generating', dotColor: 'bg-indigo-400', textColor: 'text-indigo-400', animate: true },
  streaming: { label: 'Streaming', dotColor: 'bg-blue-400', textColor: 'text-blue-400', animate: true },
};

/**
 * AIStatus — Displays the current AI service connection and streaming status.
 */
export const AIStatus = memo<AIStatusProps>(({ connectionStatus, streamingStatus, className = '' }) => {
  const displayStatus: AIConnectionStatus =
    streamingStatus === 'streaming'
      ? 'streaming'
      : streamingStatus === 'starting'
        ? 'generating'
        : connectionStatus;

  const config = STATUS_CONFIG[displayStatus] ?? STATUS_CONFIG.unavailable;

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      role="status"
      aria-label={`AI status: ${config.label}`}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {config.animate && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dotColor} opacity-75`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dotColor}`} />
      </span>
      <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
    </div>
  );
});

AIStatus.displayName = 'AIStatus';

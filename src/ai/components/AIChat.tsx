// ============================================================================
// AETHER AI — AIChat Component
// ============================================================================
// State-aware AI chat experience with multi-provider fallback transparency,
// intelligent stage indicators, retry actions, and responsive layout.
// ============================================================================

import React, { memo, useCallback, useEffect, useRef } from 'react';
import type {
  AIMessage as AIMessageType,
  AIError,
  FallbackNotice as FallbackNoticeType,
} from '../ai-types';
import { AIMessage } from './AIMessage';
import { AIInput } from './AIInput';
import { AIThinking } from './AIThinking';
import { AI_ERROR_MESSAGES } from '../ai-constants';
import { useChat } from '../hooks/useChat';
import { useAIStore } from '../ai-store';
import { ConfirmationDialog } from './ConfirmationDialog';
import { agentService } from '../services/agent-service';

interface AIChatProps {
  conversationId: string | null;
  onNewConversation: () => void;
  className?: string;
}

function ErrorBanner({
  error,
  onRetry,
  onDismiss,
}: {
  error: AIError;
  onRetry?: () => void;
  onDismiss: () => void;
}): React.ReactElement {
  const message = AI_ERROR_MESSAGES[error.code] ?? error.message;
  return (
    <div
      className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 shadow-xs backdrop-blur-sm dark:bg-rose-950/40"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <svg
          className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p className="truncate text-xs font-medium text-rose-700 dark:text-rose-200">{message}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/25 dark:text-rose-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="rounded p-1 text-rose-500 hover:bg-rose-500/15 dark:text-rose-400 focus:outline-none"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FallbackBanner({ notice }: { notice: FallbackNoticeType }): React.ReactElement {
  return (
    <div
      className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 shadow-xs dark:bg-amber-950/50"
      role="status"
      aria-live="polite"
    >
      <svg
        className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
        />
      </svg>
      <p className="flex-1 text-xs text-amber-800 dark:text-amber-200">
        <span className="font-semibold">Provider Notice:</span> Route dynamically active on{' '}
        <span className="font-bold uppercase text-amber-900 dark:text-amber-100">{notice.activeProvider}</span>.
      </p>
    </div>
  );
}

/**
 * AIChat — Full chat interface with message list, input, streaming, and error handling.
 * Handles empty state, welcome screen, and per-message rendering.
 */
export const AIChat = memo<AIChatProps>(({ conversationId: _conversationId, onNewConversation: _onNewConversation, className = '' }) => {
  const {
    messages,
    streamingStatus,
    thinkingState,
    error,
    isStreaming,
    sendMessage,
    retryMessage,
    stopGeneration,
    clearError,
  } = useChat();

  const fallbackNotice = useAIStore((s) => s.fallbackNotice);
  const pendingConfirmation = useAIStore((s) => s.pendingConfirmation);
  const setPendingConfirmation = useAIStore((s) => s.setPendingConfirmation);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming status change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, streamingStatus]);

  const handleSend = useCallback(
    (content: string) => {
      void sendMessage(content);
    },
    [sendMessage],
  );

  const handleConfirmAction = useCallback(() => {
    if (!pendingConfirmation) return;
    const toolName = pendingConfirmation.toolName;
    const { executionId, stepId } = pendingConfirmation;
    setPendingConfirmation(null);
    if (executionId && stepId) {
      void agentService.approveStep(executionId, stepId);
    }
    void sendMessage(`Confirm tool execution: ${toolName}`);
  }, [pendingConfirmation, setPendingConfirmation, sendMessage]);

  const handleCancelAction = useCallback(() => {
    setPendingConfirmation(null);
  }, [setPendingConfirmation]);

  const noMessages = messages.length === 0;

  // Empty State: when no messages and not streaming
  if (noMessages && !isStreaming) {
    return (
      <div className={`flex flex-1 flex-col overflow-y-auto ${className}`}>
        {/* Confirmation Dialog Modal */}
        {pendingConfirmation && (
          <ConfirmationDialog
            confirmation={pendingConfirmation}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
          />
        )}

        {/* Fallback Banner */}
        {fallbackNotice && fallbackNotice.usedFallback && <FallbackBanner notice={fallbackNotice} />}

        {/* Error banner with retry option */}
        {error && (
          <ErrorBanner
            error={error}
            onRetry={() => void retryMessage()}
            onDismiss={clearError}
          />
        )}

        {/* Centered Empty State Experience */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
            {/* Visual Icon */}
            <div className="relative mb-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10 transition-transform duration-300 hover:scale-105"
                aria-hidden="true"
              >
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </div>
            </div>

            {/* Typography */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-aether-main">
              Aether AI Assistant
            </h1>
            <p className="mt-2.5 max-w-md text-sm text-aether-muted leading-relaxed sm:text-base">
              Your intelligent workspace for asking questions, understanding information, and getting things done.
            </p>

            {/* Centered Primary Message Composer */}
            <div className="mt-8 w-full text-left">
              <AIInput
                onSend={handleSend}
                onStop={stopGeneration}
                isStreaming={isStreaming}
                disabled={streamingStatus === 'starting'}
                placeholder="Ask AETHER AI anything…"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Conversation View
  return (
    <div className={`flex flex-1 flex-col overflow-hidden ${className}`}>
      {/* Message list with max-width readability container */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((message: AIMessageType) => (
            <AIMessage
              key={message.id}
              message={message}
              onRetry={() => void retryMessage(message.id)}
            />
          ))}

          {/* State-aware Thinking Indicator */}
          {thinkingState && thinkingState.status !== 'idle' && (
            <div className="py-2">
              <AIThinking state={thinkingState} />
            </div>
          )}

          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {pendingConfirmation && (
        <ConfirmationDialog
          confirmation={pendingConfirmation}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}

      {/* Fallback Banner */}
      {fallbackNotice && fallbackNotice.usedFallback && <FallbackBanner notice={fallbackNotice} />}

      {/* Error banner with retry option */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={() => void retryMessage()}
          onDismiss={clearError}
        />
      )}

      {/* Input section with max-width containment */}
      <div className="border-t border-aether-border bg-aether-surface/85 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-4xl">
          <AIInput
            onSend={handleSend}
            onStop={stopGeneration}
            isStreaming={isStreaming}
            disabled={streamingStatus === 'starting'}
            placeholder="Ask AETHER AI anything…"
          />
        </div>
      </div>
    </div>
  );
});

AIChat.displayName = 'AIChat';

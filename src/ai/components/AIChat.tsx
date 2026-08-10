// ============================================================================
// AETHER AI — AIChat Component
// ============================================================================

import React, { memo, useCallback, useEffect, useRef } from 'react';
import type { AIMessage as AIMessageType, AIError } from '../ai-types';
import { AIMessage } from './AIMessage';
import { AIInput } from './AIInput';
import { AIThinking } from './AIThinking';
import { AIWelcome } from './AIWelcome';
import { AI_ERROR_MESSAGES } from '../ai-constants';
import { useChat } from '../hooks/useChat';

interface AIChatProps {
  conversationId: string | null;
  onNewConversation: () => void;
  className?: string;
}

function ErrorBanner({ error, onDismiss }: { error: AIError; onDismiss: () => void }): React.ReactElement {
  const message = AI_ERROR_MESSAGES[error.code] ?? error.message;
  return (
    <div
      className="mx-4 mb-3 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3"
      role="alert"
      aria-live="assertive"
    >
      <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="flex-1 text-xs text-red-300">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="rounded p-0.5 text-red-400 hover:bg-red-500/20 focus:outline-none"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * AIChat — Full chat interface with message list, input, streaming, and error handling.
 * Handles empty state, welcome screen, and per-message rendering.
 */
export const AIChat = memo<AIChatProps>(({ conversationId, onNewConversation, className = '' }) => {
  const {
    messages,
    streamingStatus,
    thinkingState,
    error,
    isStreaming,
    sendMessage,
    stopGeneration,
    clearError,
  } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming chunks
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, streamingStatus]);

  const handleSend = useCallback(
    (content: string) => {
      void sendMessage(content);
    },
    [sendMessage],
  );

  // No active conversation → show welcome
  if (!conversationId) {
    return (
      <div className={`flex flex-1 items-center justify-center ${className}`}>
        <AIWelcome onStartConversation={onNewConversation} className="max-w-lg" />
      </div>
    );
  }

  const noMessages = messages.length === 0;

  return (
    <div className={`flex flex-1 flex-col overflow-hidden ${className}`}>
      {/* Message list */}
      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {noMessages && !isStreaming ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message: AIMessageType) => (
              <AIMessage key={message.id} message={message} />
            ))}

            {/* Thinking indicator */}
            {thinkingState && thinkingState.status !== 'idle' && (
              <AIThinking state={thinkingState} className="px-2 py-1" />
            )}

            <div ref={bottomRef} aria-hidden="true" />
          </>
        )}
      </div>

      {/* Error banner */}
      {error && <ErrorBanner error={error} onDismiss={clearError} />}

      {/* Input */}
      <div className="border-t border-slate-800/80 bg-slate-900/80 px-4 py-3 backdrop-blur-sm">
        <AIInput
          onSend={handleSend}
          onStop={stopGeneration}
          isStreaming={isStreaming}
          disabled={streamingStatus === 'starting'}
          placeholder="Message AETHER AI…"
        />
      </div>
    </div>
  );
});

AIChat.displayName = 'AIChat';

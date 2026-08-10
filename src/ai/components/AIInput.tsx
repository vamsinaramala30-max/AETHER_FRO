// ============================================================================
// AETHER AI — AIInput Component
// ============================================================================

import React, { memo, useCallback, useRef, useState, useEffect } from 'react';

interface AIInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

/**
 * AIInput — Textarea-based message input with send, stop, keyboard shortcuts.
 * - Enter to send
 * - Shift+Enter for newline
 * - Disabled/loading state
 * - Stop generation button during streaming
 */
export const AIInput = memo<AIInputProps>(({
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = 'Message AETHER AI…',
  maxLength = 32_000,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled && !isStreaming;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, isStreaming, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value.slice(0, maxLength));
  }, [maxLength]);

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <div className="relative flex items-end gap-2 rounded-2xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 shadow-lg backdrop-blur-sm focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30">
        <textarea
          ref={textareaRef}
          id="ai-chat-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'AI unavailable' : placeholder}
          disabled={disabled}
          rows={1}
          maxLength={maxLength}
          aria-label="Message input"
          aria-multiline="true"
          className="max-h-48 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Stop / Send button */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generation"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 transition-colors hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Character count (shown near limit) */}
      {value.length > maxLength * 0.8 && (
        <p className="px-1 text-right text-[10px] text-slate-500" aria-live="polite">
          {value.length.toLocaleString()} / {maxLength.toLocaleString()}
        </p>
      )}

      <p className="px-1 text-center text-[10px] text-slate-600">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  );
});

AIInput.displayName = 'AIInput';

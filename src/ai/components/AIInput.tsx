// ============================================================================
// AETHER AI — AIInput Component
// ============================================================================
// Accessible multiline input with auto-growing height, keyboard shortcuts,
// suggestion pills, and responsive touch controls.
// ============================================================================

import React, { memo, useCallback, useRef, useState, useEffect } from 'react';

interface AIInputProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  suggestions?: string[];
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  'What tasks need my attention today?',
  'Summarize active workspace progress',
  'Search knowledge for architecture decisions',
  'Help me create a new project goal',
];

export const AIInput = memo<AIInputProps>(
  ({
    onSend,
    onStop,
    isStreaming = false,
    disabled = false,
    placeholder = 'Message AETHER AI…',
    maxLength = 32_000,
    suggestions = DEFAULT_SUGGESTIONS,
    className = '',
  }) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const canSend = value.trim().length > 0 && !disabled && !isStreaming;

    // Auto-resize textarea smoothly
    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
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

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value.slice(0, maxLength));
      },
      [maxLength],
    );

    const handleSelectSuggestion = useCallback(
      (suggestion: string) => {
        if (disabled || isStreaming) return;
        onSend(suggestion);
      },
      [disabled, isStreaming, onSend],
    );

    return (
      <div className={`relative flex flex-col gap-2.5 ${className}`}>
        {/* Suggestion pills if input is empty and not streaming */}
        {!isStreaming && !disabled && value.length === 0 && suggestions && suggestions.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Suggested prompts"
          >
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                className="whitespace-nowrap rounded-full border border-aether-border bg-aether-surface px-3 py-1.5 text-xs font-medium text-aether-muted shadow-2xs transition-all hover:border-indigo-500/40 hover:bg-aether-hover hover:text-aether-main focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <div className="relative flex items-end gap-2.5 rounded-2xl sm:rounded-3xl border border-aether-border bg-aether-surface px-4 py-3 shadow-md transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <textarea
            ref={textareaRef}
            id="ai-chat-input"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Connecting to AI…' : placeholder}
            disabled={disabled}
            rows={1}
            maxLength={maxLength}
            aria-label="Message input"
            aria-multiline="true"
            className="max-h-44 min-h-[26px] flex-1 resize-none bg-transparent text-sm sm:text-base text-aether-main placeholder:text-aether-muted/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed"
          />

          {/* Stop / Send button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generation"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500 transition-all hover:bg-red-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-95"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" rx="1.5" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Footer info: Character count & shortcuts */}
        <div className="flex items-center justify-between px-2 text-[11px] text-aether-muted/70">
          <span>Enter to send · Shift+Enter for newline</span>
          {value.length > maxLength * 0.8 && (
            <span aria-live="polite">
              {value.length.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  },
);

AIInput.displayName = 'AIInput';

import React, { useState, useRef, useEffect } from 'react';

import { useNotificationStore } from '@/state/notificationStore';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;
    const sentText = content.trim();
    onSendMessage(sentText);
    useNotificationStore.getState().addNotification({
      title: 'AI Query Sent',
      description: `Prompt: "${sentText.slice(0, 45)}${sentText.length > 45 ? '...' : ''}"`,
      type: 'ai',
    });
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative mx-auto flex max-w-5xl items-end rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/60">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask AETHER assistant..."
          disabled={disabled}
          className="max-h-36 sm:max-h-48 min-h-[40px] sm:min-h-[44px] w-full resize-none bg-transparent py-2.5 pl-3 pr-10 text-xs sm:py-3 sm:pl-4 sm:pr-12 sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50 dark:text-slate-100"
        />
        <div className="absolute bottom-1 sm:bottom-1.5 right-1.5 sm:right-2">
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
            aria-label="Send message"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

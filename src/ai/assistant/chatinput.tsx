import React, { useState, useRef, useEffect } from 'react';

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
    onSendMessage(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="relative flex items-end max-w-5xl mx-auto bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask AETHER assistant anything..."
          disabled={disabled}
          className="w-full resize-none bg-transparent py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none disabled:opacity-50 max-h-48 min-h-[44px]"
        />
        <div className="absolute right-2 bottom-1.5">
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="flex items-center justify-center p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-7-9-7v14z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};
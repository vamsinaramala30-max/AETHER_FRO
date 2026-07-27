import React from 'react';
import { Message } from './assistanttype';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {message.content}
        </span>
      </div>
    );
  }

  const displayTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const tokenCount = message.tokens?.total ?? message.tokens?.completion;
  const tokenDisplay = tokenCount ? ` • ${Math.round(tokenCount)} tkn` : null;

  return (
    <div className={`my-3 flex w-full ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`flex max-w-[80%] flex-col rounded-2xl border px-4 py-3 md:max-w-[70%] ${
          isAssistant
            ? 'border-slate-100 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
            : 'border-transparent bg-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none'
        }`}
      >
        <div className="select-text whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        <div className="mt-1.5 self-end font-mono text-[10px] opacity-60">
          {displayTime}
          {tokenDisplay}
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex justify-center my-2">
        <span className="px-3 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md">
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
    <div className={`flex w-full my-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex flex-col max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 border ${
        isAssistant 
          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-700 shadow-sm' 
          : 'bg-indigo-600 text-white border-transparent shadow-sm shadow-indigo-100 dark:shadow-none'
      }`}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap select-text">
          {message.content}
        </div>
        <div className="text-[10px] mt-1.5 self-end opacity-60 font-mono">
          {displayTime}{tokenDisplay}
        </div>
      </div>
    </div>
  );
};

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
        <span className="rounded-full border border-aether-border bg-aether-subtle px-3 py-1 font-mono text-xs text-aether-muted">
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
    <div className={`my-2.5 flex w-full ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`flex max-w-[90%] flex-col rounded-2xl border px-3.5 py-2.5 sm:max-w-[82%] sm:px-4 sm:py-3 md:max-w-[72%] ${
          isAssistant
            ? 'shadow-xs border-aether-border bg-aether-surface text-aether-main'
            : 'shadow-xs border-transparent bg-indigo-600 text-white'
        }`}
      >
        <div className="select-text overflow-x-auto whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm">
          {message.content}
        </div>
        <div className="mt-1.5 self-end font-mono text-[10px] opacity-70">
          {displayTime}
          {tokenDisplay}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Conversation } from '../assistant/assistantservice';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
}) => {
  return (
    <button
      onClick={() => {
        onSelect(conversation.id);
      }}
      className={`flex w-full cursor-pointer flex-col space-y-1 rounded-xl p-3.5 text-left transition-all ${
        isActive
          ? 'border border-indigo-100 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/40'
          : 'border border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate pr-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          {conversation.title}
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] text-slate-400">
          {new Date(conversation.updatedAt).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      {conversation.summary && (
        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          {conversation.summary}
        </p>
      )}
      <div className="pt-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
        {conversation.messageCount} messages
      </div>
    </button>
  );
};

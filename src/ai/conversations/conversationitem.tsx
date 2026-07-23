import React from 'react';
import { Conversation } from '../assistant/assistantService';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onSelect }) => {
  return (
    <button
      onClick={() => { onSelect(conversation.id); }}
      className={`w-full text-left p-3.5 rounded-xl flex flex-col space-y-1 cursor-pointer transition-all ${
        isActive 
          ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60' 
          : 'bg-transparent border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
          {conversation.title}
        </span>
        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
          {new Date(conversation.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
      </div>
      {conversation.summary && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {conversation.summary}
        </p>
      )}
      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-1">
        {conversation.messageCount} messages
      </div>
    </button>
  );
};
import React from 'react';
import { Conversation } from '../assistant/assistantService';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeId, onSelect }) => {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
        No active threads match criteria.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
      {conversations.map((convo) => (
        <ConversationItem
          key={convo.id}
          conversation={convo}
          isActive={convo.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
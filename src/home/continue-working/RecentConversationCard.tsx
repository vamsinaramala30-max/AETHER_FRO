import React from 'react';
import { RecentConversation } from './continueWorkingService';

interface RecentConversationCardProps {
  conversation: RecentConversation;
}

export const RecentConversationCard: React.FC<RecentConversationCardProps> = ({ conversation }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 p-3">
      <div>
        <h5 className="text-xs font-bold text-white">{conversation.title}</h5>
        <span className="text-[11px] text-slate-400">{conversation.context}</span>
      </div>
      <div className="text-right">
        <span className="block text-[10px] text-slate-500">{conversation.lastMessageAt}</span>
        {conversation.unreadCount > 0 && (
          <span className="py-0.2 mt-1 inline-block rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
            {conversation.unreadCount} new
          </span>
        )}
      </div>
    </div>
  );
};

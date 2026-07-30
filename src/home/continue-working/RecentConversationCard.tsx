import React from 'react';
import { RecentConversation } from './continueWorkingService';

interface RecentConversationCardProps {
  conversation: RecentConversation;
}

export const RecentConversationCard: React.FC<RecentConversationCardProps> = ({ conversation }) => {
  return (
    <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center justify-between">
      <div>
        <h5 className="text-xs font-bold text-white">{conversation.title}</h5>
        <span className="text-[11px] text-slate-400">{conversation.context}</span>
      </div>
      <div className="text-right">
        <span className="text-[10px] text-slate-500 block">{conversation.lastMessageAt}</span>
        {conversation.unreadCount > 0 && (
          <span className="inline-block mt-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {conversation.unreadCount} new
          </span>
        )}
      </div>
    </div>
  );
};
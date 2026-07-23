

import React from 'react';
import { ConversationList } from './ConversationList';
import { useAssistantState, useAssistantActions } from './assistantHooks';

export const ChatSidebar: React.FC = () => {
  const { conversations, activeConversationId, searchQuery, sidebarOpen } = useAssistantState();
  const { createConversation, setActiveConversation, renameConversation, deleteConversation, setSearchQuery, setSidebarOpen } =
    useAssistantActions();

  const filteredConversations = Object.values(conversations)
    .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  if (!sidebarOpen) return null;

  return (
    <aside
      className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 transition-all"
      aria-label="Assistant Conversations"
    >
      <div className="p-3 space-y-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={createConversation}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <span>+</span> New Chat
          </button>
          <button
            onClick={() => { setSidebarOpen(false); }}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg"
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); }}
          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <ConversationList
        conversations={filteredConversations}
        activeId={activeConversationId}
        onSelect={setActiveConversation}
        onRename={renameConversation}
        onDelete={deleteConversation}
      />
    </aside>
  );
};
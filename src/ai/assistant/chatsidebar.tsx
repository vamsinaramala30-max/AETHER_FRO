import React from 'react';
import { ConversationList } from './conversationlist';
import { useAssistantState, useAssistantActions } from './assistanthooks';

export const ChatSidebar: React.FC = () => {
  const { conversations, activeConversationId, searchQuery, sidebarOpen } = useAssistantState();
  const {
    createConversation,
    setActiveConversation,
    renameConversation,
    deleteConversation,
    setSearchQuery,
    setSidebarOpen,
  } = useAssistantActions();

  const filteredConversations = Object.values(conversations)
    .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  if (!sidebarOpen) return null;

  return (
    <aside
      className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50 transition-all dark:border-gray-800 dark:bg-gray-900"
      aria-label="Assistant Conversations"
    >
      <div className="space-y-2 border-b border-gray-200 p-3 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={createConversation}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <span>+</span> New Chat
          </button>
          <button
            onClick={() => {
              setSidebarOpen(false);
            }}
            className="ml-2 rounded-lg p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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

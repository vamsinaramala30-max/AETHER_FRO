import React, { useState } from 'react';
import { ConversationList } from './conversationlist';
import { useAssistantState, useAssistantActions } from './assistanthooks';
import { Plus, Search, X, Pin, Archive, Sparkles } from 'lucide-react';

export const ChatSidebar: React.FC = () => {
  const { conversations, activeConversationId, searchQuery, sidebarOpen } = useAssistantState();
  const {
    createConversation,
    setActiveConversation,
    renameConversation,
    deleteConversation,
    togglePinConversation,
    toggleArchiveConversation,
    setSearchQuery,
    setSidebarOpen,
  } = useAssistantActions();

  const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'archived'>('all');

  const allConvs = Object.values(conversations);

  const filteredConversations = allConvs
    .filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeTab === 'pinned') return c.metadata?.pinned && !c.metadata?.archived;
      if (activeTab === 'archived') return c.metadata?.archived;
      return !c.metadata?.archived;
    })
    .sort((a, b) => {
      // Keep pinned items on top when in 'all' view
      if (activeTab === 'all') {
        if (a.metadata?.pinned && !b.metadata?.pinned) return -1;
        if (!a.metadata?.pinned && b.metadata?.pinned) return 1;
      }
      return b.updatedAt - a.updatedAt;
    });

  if (!sidebarOpen) return null;

  const pinnedCount = allConvs.filter((c) => c.metadata?.pinned && !c.metadata?.archived).length;
  const archivedCount = allConvs.filter((c) => c.metadata?.archived).length;

  return (
    <aside
      className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/80 backdrop-blur-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/90"
      aria-label="Assistant Conversations"
    >
      {/* Header & Controls */}
      <div className="space-y-3 border-b border-slate-200 p-3.5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Conversations</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={createConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700/70 dark:bg-slate-800/60 dark:text-slate-100"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs dark:bg-slate-800/80">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'pinned'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Pin className="h-3 w-3" />
            Pinned {pinnedCount > 0 && `(${pinnedCount})`}
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'archived'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Archive className="h-3 w-3" />
            Archive {archivedCount > 0 && `(${archivedCount})`}
          </button>
        </div>
      </div>

      {/* List */}
      <ConversationList
        conversations={filteredConversations}
        activeId={activeConversationId}
        onSelect={setActiveConversation}
        onRename={renameConversation}
        onDelete={deleteConversation}
        onTogglePin={togglePinConversation}
        onToggleArchive={toggleArchiveConversation}
      />
    </aside>
  );
};

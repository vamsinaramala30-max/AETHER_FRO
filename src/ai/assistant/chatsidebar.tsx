import React from 'react';
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

  const [activeTab, setActiveTab] = React.useState<'all' | 'pinned' | 'archived'>('all');

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
      if (activeTab === 'all') {
        if (a.metadata?.pinned && !b.metadata?.pinned) return -1;
        if (!a.metadata?.pinned && b.metadata?.pinned) return 1;
      }
      return b.updatedAt - a.updatedAt;
    });

  const pinnedCount = allConvs.filter((c) => c.metadata?.pinned && !c.metadata?.archived).length;
  const archivedCount = allConvs.filter((c) => c.metadata?.archived).length;

  if (!sidebarOpen) return null;

  const content = (
    <div className="flex h-full w-72 shrink-0 flex-col border-r border-aether-border bg-aether-surface backdrop-blur-md transition-all duration-200">
      {/* Header & Controls */}
      <div className="space-y-3 border-b border-aether-border p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-aether-main">Conversations</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
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
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-aether-muted" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="placeholder:text-aether-muted/60 w-full rounded-xl border border-aether-border bg-aether-subtle py-2 pl-8 pr-3 text-xs text-aether-main transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-aether-subtle p-1 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-aether-surface text-aether-main shadow-sm'
                : 'text-aether-muted hover:text-aether-main'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'pinned'
                ? 'bg-aether-surface text-aether-main shadow-sm'
                : 'text-aether-muted hover:text-aether-main'
            }`}
          >
            <Pin className="h-3 w-3" />
            Pinned {pinnedCount > 0 && `(${pinnedCount})`}
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-medium transition-all ${
              activeTab === 'archived'
                ? 'bg-aether-surface text-aether-main shadow-sm'
                : 'text-aether-muted hover:text-aether-main'
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
        onSelect={(id) => {
          setActiveConversation(id);
          // Close on mobile selection
          if (window.innerWidth < 768) {
            setSidebarOpen(false);
          }
        }}
        onRename={renameConversation}
        onDelete={deleteConversation}
        onTogglePin={togglePinConversation}
        onToggleArchive={toggleArchiveConversation}
      />
    </div>
  );

  return (
    <>
      {/* Mobile drawer version */}
      <div className="fixed inset-y-0 left-0 z-40 flex md:hidden">
        <div
          className="backdrop-blur-xs fixed inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <aside className="relative z-50 flex h-full max-w-[80vw] shadow-2xl">{content}</aside>
      </div>

      {/* Desktop in-flow version */}
      <aside className="hidden h-full shrink-0 md:flex">{content}</aside>
    </>
  );
};

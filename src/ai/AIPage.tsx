// ============================================================================
// AETHER AI — AIPage Component
// ============================================================================
// Composes AIHeader, AISidebar, AIChat, and all panel views.
// Handles responsive layout and mobile drawer.
// ============================================================================

import React, { memo, lazy, Suspense, useCallback } from 'react';
import { AIHeader } from './components/AIHeader';
import { AISidebar } from './components/AISidebar';
import { AIChat } from './components/AIChat';
import { useAI } from './hooks/useAI';
import { useChat } from './hooks/useChat';
import type { AIPanel } from './ai-types';

// Lazy load secondary panels for performance
const ConversationList = lazy(() =>
  import('./components/ConversationList').then((m) => ({ default: m.ConversationList })),
);
const MemoryPanel = lazy(() =>
  import('./components/MemoryPanel').then((m) => ({ default: m.MemoryPanel })),
);
const KnowledgePanel = lazy(() =>
  import('./components/KnowledgePanel').then((m) => ({ default: m.KnowledgePanel })),
);
const PromptPanel = lazy(() =>
  import('./components/PromptPanel').then((m) => ({ default: m.PromptPanel })),
);
const ModelPanel = lazy(() =>
  import('./components/ModelPanel').then((m) => ({ default: m.ModelPanel })),
);
const AgentPanel = lazy(() =>
  import('./components/AgentPanel').then((m) => ({ default: m.AgentPanel })),
);

function PanelLoading(): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" aria-label="Loading panel" />
    </div>
  );
}

function PanelContent({ panel, chatActions }: {
  panel: AIPanel;
  chatActions: ReturnType<typeof useChat>;
}): React.ReactElement | null {
  if (panel === 'assistant') {
    return (
      <AIChat
        conversationId={chatActions.activeConversationId}
        onNewConversation={() => void chatActions.createConversation()}
        className="flex-1"
      />
    );
  }

  if (panel === 'conversations') {
    return (
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<PanelLoading />}>
          <ConversationList
            conversations={Object.values(chatActions.conversations)}
            activeConversationId={chatActions.activeConversationId}
            onSelect={(id) => void chatActions.selectConversation(id)}
            onRename={(id, title) => void chatActions.renameConversation(id, title)}
            onDelete={(id) => void chatActions.deleteConversation(id)}
            onNew={() => void chatActions.createConversation()}
          />
        </Suspense>
      </div>
    );
  }

  const PANEL_MAP: Partial<Record<AIPanel, React.ComponentType>> = {
    memory: MemoryPanel,
    knowledge: KnowledgePanel,
    prompts: PromptPanel,
    models: ModelPanel,
    agents: AgentPanel,
  };

  const Component = PANEL_MAP[panel];
  if (!Component) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <Suspense fallback={<PanelLoading />}>
        <Component />
      </Suspense>
    </div>
  );
}

/**
 * AIPage — Full-page AI experience with responsive sidebar and panel switching.
 */
export const AIPage = memo(() => {
  const {
    connectionStatus,
    activeModel,
    sidebarOpen,
    activePanel,
    toggleSidebar,
    setSidebarOpen,
    setActivePanel,
  } = useAI();

  const chatActions = useChat();

  const handlePanelChange = useCallback(
    (panel: AIPanel) => {
      setActivePanel(panel);
      // On mobile, close sidebar after selection
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    [setActivePanel, setSidebarOpen],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <AIHeader
        connectionStatus={connectionStatus}
        activeModel={activeModel}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`absolute left-0 top-0 z-30 h-full w-64 transform border-r border-slate-800/80 bg-slate-900/95 transition-transform duration-300 ease-in-out backdrop-blur-sm lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="AI sidebar"
        >
          <AISidebar className="h-full overflow-y-auto p-3" />
        </aside>

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden" role="main">
          <PanelContent panel={activePanel} chatActions={chatActions} />
        </main>
      </div>
    </div>
  );
});

AIPage.displayName = 'AIPage';

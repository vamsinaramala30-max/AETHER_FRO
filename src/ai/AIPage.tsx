// ============================================================================
// AETHER AI — AIPage Component
// ============================================================================
// Authoritative full-width AI Assistant experience.
// Clean workspace without duplicate sidebars, displaying real system status,
// live provider switching, active conversation management, and AIChat.
// ============================================================================

import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { AIChat } from './components/AIChat';
import { useAI } from './hooks/useAI';
import { useChat } from './hooks/useChat';
import { useAIStore } from './ai-store';
import type { AIProviderMode } from './ai-types';

const PROVIDERS: { id: AIProviderMode; label: string; badge: string }[] = [
  { id: 'auto', label: 'Auto (Aether Native)', badge: 'Aether Core' },
  { id: 'aether', label: 'Aether (Native)', badge: 'Aether' },
  { id: 'gemini', label: 'Gemini (Cloud)', badge: 'Gemini' },
  { id: 'openai', label: 'OpenAI (Cloud)', badge: 'OpenAI' },
  { id: 'ollama', label: 'Ollama (Local)', badge: 'Ollama' },
];

export interface AIPageProps {
  showSidebar?: boolean;
}

export const AIPage = memo<AIPageProps>(() => {
  const { connectionStatus, activeModel } = useAI();
  const chatActions = useChat();

  const providerMode = useAIStore((s) => s.providerMode);
  const setProviderMode = useAIStore((s) => s.setProviderMode);
  const documents = useAIStore((s) => s.documents);
  const memoryEntries = useAIStore((s) => s.memoryEntries);

  const [convDropdownOpen, setConvDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close conversation dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setConvDropdownOpen(false);
      }
    }
    if (convDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [convDropdownOpen]);

  const handleNewChat = useCallback(() => {
    void chatActions.createConversation();
    setConvDropdownOpen(false);
  }, [chatActions]);

  const handleSelectConv = useCallback((id: string) => {
    void chatActions.selectConversation(id);
    setConvDropdownOpen(false);
  }, [chatActions]);

  const convList = Object.values(chatActions.conversations);
  const activeConv = chatActions.activeConversation;

  // Real, dynamic AI readiness status
  const getStatusDisplay = () => {
    if (chatActions.streamingStatus === 'streaming') {
      return { label: 'Streaming…', color: 'bg-blue-400', text: 'text-blue-500 dark:text-blue-400', ping: true };
    }
    if (chatActions.streamingStatus === 'starting') {
      return { label: 'Generating…', color: 'bg-indigo-400', text: 'text-indigo-500 dark:text-indigo-400', ping: true };
    }
    if (connectionStatus === 'connected') {
      return { label: 'AI Ready', color: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', ping: true };
    }
    if (connectionStatus === 'connecting') {
      return { label: 'Connecting…', color: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', ping: true };
    }
    if (connectionStatus === 'error') {
      return { label: 'Unavailable', color: 'bg-red-400', text: 'text-red-500 dark:text-red-400', ping: false };
    }
    return { label: 'Offline', color: 'bg-slate-400', text: 'text-slate-500 dark:text-slate-400', ping: false };
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-aether-bg">
      {/* Small AI Assistant Subheader (Breadcrumb, Real AI Status, Model / Provider Controls) */}
      <div
        className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-aether-border bg-aether-surface/90 px-4 py-2.5 backdrop-blur-md sm:px-6"
        role="region"
        aria-label="AI Assistant Header"
      >
        {/* Left: Breadcrumbs & Real AI Readiness Status */}
        <div className="flex items-center gap-3 min-w-0">
          <nav aria-label="AI breadcrumb" className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-aether-muted">AI</span>
            <span className="text-aether-muted/40">/</span>
            <span className="font-bold text-aether-main">Assistant</span>
          </nav>

          {/* Real AI Status indicator */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full border border-aether-border bg-aether-subtle px-2.5 py-0.5 text-[11px] font-semibold"
            role="status"
            aria-label={`AI Status: ${statusInfo.label}`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {statusInfo.ping && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusInfo.color} opacity-75`}
                />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${statusInfo.color}`} />
            </span>
            <span className={statusInfo.text}>{statusInfo.label}</span>
          </div>

          {/* Conversation Title & Switcher dropdown */}
          {convList.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setConvDropdownOpen((prev) => !prev)}
                aria-expanded={convDropdownOpen}
                aria-haspopup="listbox"
                className="flex max-w-[180px] sm:max-w-[240px] items-center gap-1.5 rounded-lg border border-aether-border bg-aether-subtle px-2 py-1 text-xs text-aether-muted transition-colors hover:bg-aether-hover hover:text-aether-main"
                title={activeConv?.title ?? 'Conversations'}
              >
                <span className="truncate font-medium">{activeConv?.title ?? 'Conversations'}</span>
                <svg
                  className={`h-3 w-3 shrink-0 transition-transform ${convDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {convDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-50 mt-1 max-h-64 w-64 overflow-y-auto rounded-xl border border-aether-border bg-aether-surface p-1.5 shadow-xl backdrop-blur-md"
                  role="listbox"
                >
                  <div className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-aether-muted">
                    Recent Conversations
                  </div>
                  {convList.map((conv) => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConv(conv.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                        conv.id === activeConv?.id
                          ? 'bg-indigo-500/15 font-semibold text-indigo-600 dark:text-indigo-400'
                          : 'text-aether-muted hover:bg-aether-hover hover:text-aether-main'
                      }`}
                    >
                      <span className="truncate">{conv.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions, Provider Selector & Active Model */}
        <div className="flex items-center gap-2">
          {/* Lightweight Context Counters (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-aether-muted border-r border-aether-border pr-2.5">
            {documents.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-aether-surface-elevated px-1.5 py-0.5" title="Indexed documents">
                <span>📚</span> {documents.length}
              </span>
            )}
            {memoryEntries.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-aether-surface-elevated px-1.5 py-0.5" title="Memory entries">
                <span>🧠</span> {memoryEntries.length}
              </span>
            )}
          </div>

          {/* Provider Selector */}
          <select
            id="ai-provider-select"
            value={providerMode}
            onChange={(e) => setProviderMode(e.target.value as AIProviderMode)}
            aria-label="Select AI Provider"
            className="rounded-lg border border-aether-border bg-aether-surface px-2 py-1 text-xs font-medium text-aether-main shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Active Model Badge */}
          {activeModel && (
            <div
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-aether-border bg-aether-subtle px-2 py-0.5 text-xs text-aether-muted"
              title={`Active Model: ${activeModel.name}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span className="max-w-[100px] truncate">{activeModel.name}</span>
            </div>
          )}

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
            aria-label="Start new conversation"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Main content viewport — 100% full-width Assistant workspace */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden" role="main">
        <AIChat
          conversationId={chatActions.activeConversationId}
          onNewConversation={handleNewChat}
          className="flex-1"
        />
      </main>
    </div>
  );
});

AIPage.displayName = 'AIPage';

export default AIPage;

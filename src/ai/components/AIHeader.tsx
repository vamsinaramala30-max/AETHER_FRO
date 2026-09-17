// ============================================================================
// AETHER AI — AIHeader Component with Provider & Context Visibility
// ============================================================================

import React, { memo } from 'react';
import type { AIModelInfo, AIConnectionStatus, AIProviderMode } from '../ai-types';
import { AIStatus } from './AIStatus';
import { useAIStore } from '../ai-store';

interface AIHeaderProps {
  connectionStatus: AIConnectionStatus;
  activeModel: AIModelInfo | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

const PROVIDERS: { id: AIProviderMode; label: string; badge: string }[] = [
  { id: 'auto', label: 'Auto (Aether Native)', badge: 'Aether Core' },
  { id: 'aether', label: 'Aether (Native)', badge: 'Aether' },
  { id: 'gemini', label: 'Gemini (Cloud)', badge: 'Gemini' },
  { id: 'openai', label: 'OpenAI (Cloud)', badge: 'OpenAI' },
  { id: 'ollama', label: 'Ollama (Local)', badge: 'Ollama' },
];

/**
 * AIHeader — Branding, provider selector, active model status, and responsive sidebar toggle.
 */
export const AIHeader = memo<AIHeaderProps>(
  ({ connectionStatus, activeModel, sidebarOpen, onToggleSidebar, className = '' }) => {
    const providerMode = useAIStore((s) => s.providerMode);
    const setProviderMode = useAIStore((s) => s.setProviderMode);
    const activeConversationId = useAIStore((s) => s.activeConversationId);
    const conversations = useAIStore((s) => s.conversations);
    const documents = useAIStore((s) => s.documents);
    const memoryEntries = useAIStore((s) => s.memoryEntries);

    const activeConv = activeConversationId ? conversations[activeConversationId] : null;

    return (
      <header
        className={`flex items-center justify-between border-b border-aether-border bg-aether-surface/90 px-4 py-2.5 backdrop-blur-md ${className}`}
        role="banner"
      >
        {/* Left: Sidebar Toggle & Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-aether-muted hover:bg-aether-hover hover:text-aether-main focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>

          {/* Branding */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm"
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <span className="hidden text-sm font-bold text-aether-main sm:inline-block">AETHER AI</span>
          </div>

          {/* Active conversation title if present */}
          {activeConv && (
            <div className="hidden items-center gap-1.5 border-l border-aether-border pl-2.5 md:flex min-w-0 max-w-[200px] lg:max-w-[280px]">
              <span className="truncate text-xs font-medium text-aether-muted" title={activeConv.title}>
                {activeConv.title}
              </span>
            </div>
          )}
        </div>

        {/* Center/Right: Provider Selector & Context stats */}
        <div className="flex items-center gap-2.5">
          {/* Lightweight Context Indicators (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] text-aether-muted font-mono border-r border-aether-border pr-3">
            {documents.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-aether-surface-elevated px-1.5 py-0.5" title="Indexed Knowledge Base documents">
                <span>📚</span> {documents.length} docs
              </span>
            )}
            {memoryEntries.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-aether-surface-elevated px-1.5 py-0.5" title="User memory entries">
                <span>🧠</span> {memoryEntries.length} mem
              </span>
            )}
          </div>

          {/* Provider Selector */}
          <div className="flex items-center gap-1.5">
            <select
              id="ai-provider-select"
              value={providerMode}
              onChange={(e) => setProviderMode(e.target.value as AIProviderMode)}
              aria-label="Select AI Provider"
              className="rounded-lg border border-aether-border bg-aether-surface px-2 py-1 text-xs font-medium text-aether-main shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active model & Status indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {activeModel && (
              <div
                className="hidden items-center gap-1.5 rounded-lg bg-aether-surface-elevated border border-aether-border px-2 py-0.5 text-xs text-aether-muted lg:flex"
                aria-label={`Active model: ${activeModel.name}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="max-w-[100px] truncate">{activeModel.name}</span>
              </div>
            )}
            <AIStatus connectionStatus={connectionStatus} />
          </div>
        </div>
      </header>
    );
  },
);

AIHeader.displayName = 'AIHeader';

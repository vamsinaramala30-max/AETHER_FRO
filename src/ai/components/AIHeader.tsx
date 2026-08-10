// ============================================================================
// AETHER AI — AIHeader Component with Provider Selection
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
  { id: 'auto', label: 'Auto (Gemini → OpenAI)', badge: 'Auto Fallback' },
  { id: 'gemini', label: 'Gemini (Primary)', badge: 'Gemini' },
  { id: 'openai', label: 'OpenAI (Fallback)', badge: 'OpenAI' },
  { id: 'ollama', label: 'Ollama (Local)', badge: 'Ollama' },
];

/**
 * AIHeader — Branding, provider selector, active model status, and responsive sidebar toggle.
 */
export const AIHeader = memo<AIHeaderProps>(({
  connectionStatus,
  activeModel,
  sidebarOpen,
  onToggleSidebar,
  className = '',
}) => {
  const providerMode = useAIStore((s) => s.providerMode);
  const setProviderMode = useAIStore((s) => s.setProviderMode);

  return (
    <header
      className={`flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-3 backdrop-blur-sm ${className}`}
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* Sidebar toggle (mobile) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

        {/* Branding */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow"
            aria-hidden="true"
          >
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="hidden text-sm font-bold text-white sm:block">AETHER AI</span>
        </div>
      </div>

      {/* Center: Provider Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="ai-provider-select" className="hidden text-xs text-slate-400 md:inline">
          Provider:
        </label>
        <select
          id="ai-provider-select"
          value={providerMode}
          onChange={(e) => setProviderMode(e.target.value as AIProviderMode)}
          aria-label="Select AI Provider"
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {PROVIDERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Active model & Status */}
      <div className="flex items-center gap-3">
        {activeModel && (
          <div className="hidden items-center gap-2 lg:flex" aria-label={`Active model: ${activeModel.name}`}>
            <span className="text-xs text-slate-500">Model:</span>
            <span className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200">
              {activeModel.name}
            </span>
          </div>
        )}
        <AIStatus connectionStatus={connectionStatus} />
      </div>
    </header>
  );
});

AIHeader.displayName = 'AIHeader';

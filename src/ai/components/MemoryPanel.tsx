// ============================================================================
// AETHER AI — MemoryPanel Component
// ============================================================================

import React, { memo, useState } from 'react';
import type { MemoryEntry, MemoryScope } from '../ai-types';
import { useMemory } from '../hooks/useMemory';

const SCOPE_LABELS: Record<MemoryScope, string> = {
  working: 'Working',
  conversation: 'Conversation',
  long_term: 'Long-Term',
};

const SCOPE_COLORS: Record<MemoryScope, string> = {
  working: 'text-amber-400',
  conversation: 'text-blue-400',
  long_term: 'text-purple-400',
};

interface MemoryEntryRowProps {
  entry: MemoryEntry;
  onDelete: (id: string) => void;
}

const MemoryEntryRow = memo<MemoryEntryRowProps>(({ entry, onDelete }) => (
  <div className="group flex items-start gap-3 rounded-lg border border-aether-border bg-aether-ai-panel-item p-3">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${SCOPE_COLORS[entry.scope]}`}
        >
          {SCOPE_LABELS[entry.scope]}
        </span>
        <span className="text-[10px] text-aether-subtleText">·</span>
        <span className="text-[10px] capitalize text-aether-muted">{entry.type}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-aether-main">{entry.content}</p>
    </div>
    <button
      type="button"
      onClick={() => onDelete(entry.id)}
      aria-label="Delete memory entry"
      className="mt-0.5 shrink-0 rounded p-1 text-aether-subtleText opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus-visible:opacity-100 group-hover:opacity-100"
    >
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
));

MemoryEntryRow.displayName = 'MemoryEntryRow';

/**
 * MemoryPanel — Displays user-scoped memory entries with delete capability.
 */
export const MemoryPanel = memo(() => {
  const { entries, status, deleteEntry, refresh } = useMemory();
  const [filter, setFilter] = useState<MemoryScope | 'all'>('all');

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.scope === filter);
  const sorted = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="memory-panel-heading">
      <div className="flex items-center justify-between">
        <h2 id="memory-panel-heading" className="text-sm font-semibold text-aether-main">
          Memory
        </h2>
        <button
          type="button"
          onClick={() => void refresh()}
          aria-label="Refresh memory"
          className="rounded-lg p-1.5 text-aether-muted hover:bg-aether-hover hover:text-aether-main focus:outline-none"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Status summary */}
      {status && (
        <div className="grid grid-cols-3 gap-2">
          {(['working', 'conversation', 'long_term'] as MemoryScope[]).map((scope) => (
            <div key={scope} className="rounded-lg bg-aether-subtle p-2 text-center">
              <p className={`text-base font-bold ${SCOPE_COLORS[scope]}`}>
                {scope === 'working'
                  ? status.workingEntries
                  : scope === 'conversation'
                    ? status.conversationEntries
                    : status.longTermEntries}
              </p>
              <p className="text-[10px] text-aether-muted">{SCOPE_LABELS[scope]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-1.5" role="group" aria-label="Filter by scope">
        {(['all', 'working', 'conversation', 'long_term'] as const).map((scope) => (
          <button
            key={scope}
            type="button"
            onClick={() => setFilter(scope)}
            aria-pressed={filter === scope}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              filter === scope
                ? 'bg-indigo-600 text-white'
                : 'bg-aether-subtle text-aether-muted hover:bg-aether-hover hover:text-aether-main'
            }`}
          >
            {scope === 'all' ? 'All' : SCOPE_LABELS[scope]}
          </button>
        ))}
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-aether-border bg-aether-subtle p-6 text-center">
          <p className="text-xs text-aether-muted">No memory entries found.</p>
          <p className="mt-1 text-[11px] text-aether-subtleText">
            Memory is populated as you interact with the AI.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Memory entries">
          {sorted.map((entry) => (
            <li key={entry.id}>
              <MemoryEntryRow entry={entry} onDelete={(id) => void deleteEntry(id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

MemoryPanel.displayName = 'MemoryPanel';

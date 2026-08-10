// ============================================================================
// AETHER AI — SourceCitation Component
// ============================================================================
// Displays citations returned by the backend. Never invents citations.
// ============================================================================

import React, { memo, useState } from 'react';
import type { SourceCitationRef } from '../ai-types';

interface SourceCitationProps {
  citations: SourceCitationRef[];
  className?: string;
}

interface CitationItemProps {
  citation: SourceCitationRef;
  index: number;
}

const CitationItem = memo<CitationItemProps>(({ citation, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="group">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-2 rounded-lg p-2 text-left transition-colors hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-expanded={expanded}
        id={`citation-${citation.id}`}
      >
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-300">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-200">{citation.title}</p>
          {citation.score !== undefined && (
            <span className="text-[10px] text-slate-500">
              {Math.round(citation.score * 100)}% relevance
            </span>
          )}
        </div>
        <svg
          className={`mt-0.5 h-3 w-3 shrink-0 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && citation.snippet && (
        <div
          className="mx-2 mt-1 rounded-md bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-400"
          role="region"
          aria-labelledby={`citation-${citation.id}`}
        >
          {citation.snippet}
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-indigo-400 hover:underline"
              aria-label={`Open source: ${citation.title}`}
            >
              {citation.url}
            </a>
          )}
        </div>
      )}
    </li>
  );
});

CitationItem.displayName = 'CitationItem';

/**
 * SourceCitation — Renders backend-provided citations only.
 * Never displays invented or synthetic citations.
 */
export const SourceCitation = memo<SourceCitationProps>(({ citations, className = '' }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <section className={`mt-3 rounded-xl border border-slate-700/60 bg-slate-800/40 ${className}`}>
      <header className="border-b border-slate-700/60 px-3 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Sources ({citations.length})
        </h3>
      </header>
      <ol className="divide-y divide-slate-700/40 p-1" aria-label="Source citations">
        {citations.map((citation, idx) => (
          <CitationItem key={citation.id} citation={citation} index={idx} />
        ))}
      </ol>
    </section>
  );
});

SourceCitation.displayName = 'SourceCitation';

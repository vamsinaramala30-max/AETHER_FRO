import React from 'react';
import { MemoryItem } from './memoryservice';

interface MemoryCardProps {
  memory: MemoryItem;
  onPrune: (id: string) => void;
}

const scopeStyles: Record<string, string> = {
  GLOBAL_USER: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40',
  WORKSPACE: 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40',
  PROJECT: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
  CONVERSATION: 'bg-slate-50 text-slate-600 border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const confidenceStyles: Record<string, string> = {
  confirmed: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
  user_provided: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/40',
  inferred: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40',
  temporary: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
};

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onPrune }) => {
  const scopeClass = (memory.scope && scopeStyles[memory.scope]) || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  const confidenceClass = (memory.confidence && confidenceStyles[memory.confidence]) || 'text-slate-500 bg-slate-100 dark:bg-slate-800';

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {memory.category}
            </span>
            {memory.scope && (
              <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${scopeClass}`}>
                {memory.scope.replace('_', ' ')}
              </span>
            )}
            {memory.confidence && (
              <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] capitalize ${confidenceClass}`}>
                {memory.confidence.replace('_', ' ')}
              </span>
            )}
            {memory.version && memory.version > 1 && (
              <span className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[9px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                v{memory.version}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              Weight:{' '}
              <b className="text-slate-600 dark:text-slate-300">{memory.importanceScore}/10</b>
            </span>
            <button
              onClick={() => {
                onPrune(memory.id);
              }}
              className="cursor-pointer rounded p-0.5 text-slate-400 transition-colors hover:text-rose-500"
              title="Prune Memory"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <p className="select-text font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {memory.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        {memory.associatedTokens.map((t) => (
          <span
            key={t}
            className="rounded bg-indigo-50/60 px-1.5 py-0.5 font-mono text-[9px] text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
};


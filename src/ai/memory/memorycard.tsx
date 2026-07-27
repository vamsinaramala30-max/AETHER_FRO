import React from 'react';
import { MemoryItem } from './memoryservice';

interface MemoryCardProps {
  memory: MemoryItem;
  onPrune: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onPrune }) => {
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {memory.category}
          </span>
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
              title="Prune Vector Cell"
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

import React from 'react';
import { MemoryItem } from './memoryService';

interface MemoryCardProps {
  memory: MemoryItem;
  onPrune: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onPrune }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {memory.category}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Weight: <b className="text-slate-600 dark:text-slate-300">{memory.importanceScore}/10</b>
            </span>
            <button 
              onClick={() => { onPrune(memory.id); }}
              className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              title="Prune Vector Cell"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed select-text font-sans">
          {memory.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 pt-1">
        {memory.associatedTokens.map((t) => (
          <span key={t} className="text-[9px] font-mono bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
};
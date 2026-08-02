import React from 'react';
import { KnowledgeNode } from '../types';

interface KnowledgeCardProps {
  node: KnowledgeNode;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ node }) => {
  const badgeColors = {
    note: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    document:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    concept:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColors[node.type]}`}
          >
            {node.type}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Connections: {node.connections.length}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
          {node.label}
        </h3>
      </div>
      {node.connections.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          {node.connections.map((c) => (
            <span
              key={c}
              className="rounded-md border border-slate-200 bg-slate-100/70 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

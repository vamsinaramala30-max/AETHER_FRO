// frontend/src/knowledge/knowledge-base/KnowledgeCard.tsx
import React from 'react';
import { KnowledgeNode } from '../types';

interface KnowledgeCardProps {
  node: KnowledgeNode;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ node }) => {
  const badgeColors = {
    note: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    document: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    concept: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase ${badgeColors[node.type]}`}
          >
            {node.type}
          </span>
          <span className="font-mono text-[10px] text-neutral-500">
            Connections: {node.connections.length}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-medium text-white">{node.label}</h3>
      </div>
      {node.connections.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-neutral-800/60 pt-2">
          {node.connections.map((c) => (
            <span
              key={c}
              className="rounded border border-neutral-800 bg-neutral-950 px-1.5 py-0.5 text-[9px] text-neutral-400"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

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
    concept: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-all">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${badgeColors[node.type]}`}>
            {node.type}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Connections: {node.connections.length}</span>
        </div>
        <h3 className="text-white font-medium text-sm line-clamp-1">{node.label}</h3>
      </div>
      {node.connections.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-neutral-800/60 pt-2">
          {node.connections.map(c => (
            <span key={c} className="text-[9px] text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
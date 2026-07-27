// frontend/src/knowledge/knowledge-base/KnowledgeBasePage.tsx
import React, { useState, useEffect } from 'react';
import { KnowledgeNode } from '../types';
import { knowledgeBaseService } from './knowledgebasedservice';
import { KnowledgeGraph } from './knowledgegraph';
import { KnowledgeCard } from './konwedgecard';

export const KnowledgeBasePage: React.FC = () => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await knowledgeBaseService.getGraphData();
      setNodes(data);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Relational Matrix</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Unified semantic structural link topology view of system records.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 animate-pulse items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 font-mono text-xs text-neutral-400">
          Computing active connections topological trace...
        </div>
      ) : (
        <>
          <KnowledgeGraph nodes={nodes} />

          <div className="space-y-3">
            <h2 className="text-sm text-xs font-medium uppercase tracking-wide text-neutral-400 text-white">
              Indexed Map Nodes ({nodes.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {nodes.map((node) => (
                <KnowledgeCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

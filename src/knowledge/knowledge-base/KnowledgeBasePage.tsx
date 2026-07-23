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
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Relational Matrix</h1>
        <p className="text-xs text-neutral-400 mt-1">Unified semantic structural link topology view of system records.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center border border-neutral-800 border-dashed rounded-xl bg-neutral-900/40 font-mono text-xs text-neutral-400 animate-pulse">
          Computing active connections topological trace...
        </div>
      ) : (
        <>
          <KnowledgeGraph nodes={nodes} />
          
          <div className="space-y-3">
            <h2 className="text-white font-medium text-sm tracking-wide uppercase text-neutral-400 text-xs">Indexed Map Nodes ({nodes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nodes.map(node => (
                <KnowledgeCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


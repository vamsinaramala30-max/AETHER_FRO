import React, { useState, useEffect } from 'react';
import { KnowledgeNode } from '../types';
import { knowledgeBaseService } from './knowledgebasedservice';
import { KnowledgeGraph } from './knowledgegraph';
import { KnowledgeCard } from './konwedgecard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Database } from 'lucide-react';

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
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Knowledge Base & Relational Graph
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unified semantic structural link topology view of workspace records and vector nodes.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-xs font-semibold text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400">
          <span className="animate-pulse">Computing active connections topological trace...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <KnowledgeGraph nodes={nodes} />

          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Indexed Map Nodes ({nodes.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {nodes.map((node) => (
                <KnowledgeCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

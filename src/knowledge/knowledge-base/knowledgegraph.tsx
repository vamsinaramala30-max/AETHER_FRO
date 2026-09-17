import React from 'react';
import { KnowledgeNode } from '../types';
import { Network } from 'lucide-react';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <Network className="mb-2 h-10 w-10 text-slate-400" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          No connected knowledge yet
        </p>
        <p className="mt-1 max-w-sm text-xs text-slate-400">
          Add files, documents, projects, or notes to start building your connected AETHER knowledge
          graph.
        </p>
      </div>
    );
  }

  const width = 800;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const positionedNodes = nodes.map((node, index) => {
    const angle = index * ((Math.PI * 2) / Math.min(nodes.length, 16)) + index * 0.15;
    const radius = 60 + (index % 3) * 65;
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  const links: Array<{ x1: number; y1: number; x2: number; y2: number; id: string }> = [];
  positionedNodes.forEach((source) => {
    (source.connections || []).forEach((targetId) => {
      const target = nodeMap.get(targetId);
      if (target) {
        links.push({
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y,
          id: `${source.id}-${targetId}`,
        });
      }
    });
  });

  const colorMap: Record<string, string> = {
    note: '#f59e0b',
    document: '#10b981',
    concept: '#a855f7',
    project: '#6366f1',
    task: '#ec4899',
    file: '#3b82f6',
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto min-w-[800px]">
        <svg width={width} height={height} className="mx-auto block">
          {links.map((link) => (
            <line
              key={link.id}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke="currentColor"
              className="text-slate-300 opacity-60 dark:text-slate-700"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          ))}

          {positionedNodes.map((node) => (
            <g key={node.id} className="group cursor-pointer">
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'concept' ? '8' : '6'}
                fill={colorMap[node.type] || '#64748b'}
                className="opacity-80 transition-all duration-200 group-hover:scale-125 group-hover:opacity-100"
              />
              <text
                x={node.x}
                y={node.y - 12}
                textAnchor="middle"
                className="pointer-events-none select-none fill-slate-700 text-[10px] font-bold transition-colors group-hover:fill-indigo-600 dark:fill-slate-300 dark:group-hover:fill-white"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-5 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span> Project
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span> Task
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Document
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Note
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> File
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span> Concept / Tag
        </div>
      </div>
    </div>
  );
};

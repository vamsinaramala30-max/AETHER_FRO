// frontend/src/knowledge/knowledge-base/KnowledgeGraph.tsx
import React from 'react';
import { KnowledgeNode } from '../types';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ nodes }) => {
  // Generate reliable positions structurally using a predictable spiral algorithm for scalability
  const width = 800;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const positionedNodes = nodes.map((node, index) => {
    const angle = index * ((Math.PI * 2) / Math.min(nodes.length, 12)) + index * 0.2;
    const radius = 50 + Math.floor(index / 6) * 60;
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  // Resolve logical links safely
  const links: Array<{ x1: number; y1: number; x2: number; y2: number; id: string }> = [];
  positionedNodes.forEach((source) => {
    source.connections.forEach((targetId) => {
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

  const colorMap = {
    note: '#f59e0b',
    document: '#3b82f6',
    concept: '#a855f7',
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="mx-auto min-w-[800px]">
        <svg width={width} height={height} className="mx-auto block">
          {/* Render Vector Graph Paths */}
          {links.map((link) => (
            <line
              key={link.id}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              stroke="#262626"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          ))}

          {/* Render Cluster Nodes */}
          {positionedNodes.map((node) => (
            <g key={node.id} className="group cursor-pointer">
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'concept' ? '8' : '6'}
                fill={colorMap[node.type]}
                className="group-hover:r-10 opacity-80 transition-all duration-200 group-hover:opacity-100"
              />
              <text
                x={node.x}
                y={node.y - 12}
                textAnchor="middle"
                fill="#a3a3a3"
                className="pointer-events-none select-none font-mono text-[10px] font-medium transition-colors group-hover:fill-white"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-center gap-6 border-t border-neutral-900 pt-3 font-mono text-[10px] text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span> Atomic Note
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span> Document Node
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-500"></span> Structural Tag
        </div>
      </div>
    </div>
  );
};

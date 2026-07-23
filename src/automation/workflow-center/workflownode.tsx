// frontend/src/automation/workflow-center/WorkflowNode.tsx
import React from 'react';
import { WorkflowNodeData } from './workflowService';

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  index: number;
  onUpdateConfig?: (id: string, config: Record<string, any>) => void;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ node, index, onUpdateConfig }) => {
  const getTypeStyles = () => {
    switch (node.type) {
      case 'trigger':
        return 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
      case 'condition':
        return 'border-amber-500/30 bg-amber-950/20 text-amber-400';
      case 'action':
        return 'border-sky-500/30 bg-sky-950/20 text-sky-400';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {index > 0 && (
        <div className="w-0.5 h-8 bg-gradient-to-b from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700 my-1" />
      )}
      
      <div className={`w-full p-4 rounded-xl border transition-all duration-200 shadow-sm ${getTypeStyles()}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
            {node.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Step {index + 1}
          </span>
        </div>
        
        <h4 className="text-sm font-medium text-slate-200 dark:text-slate-100 mb-2">
          {node.name}
        </h4>

        <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-800/60">
          {Object.entries(node.config).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">{key}:</span>
              <input
                type="text"
                className="bg-slate-900/60 border border-slate-800 rounded px-2 py-0.5 text-slate-200 font-mono text-right max-w-[180px] focus:outline-none focus:border-slate-600"
                value={value}
                onChange={(e) => onUpdateConfig?.(node.id, { ...node.config, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
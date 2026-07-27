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
    <div className="flex w-full max-w-md flex-col items-center">
      {index > 0 && (
        <div className="my-1 h-8 w-0.5 bg-gradient-to-b from-slate-700 to-slate-600 dark:from-slate-800 dark:to-slate-700" />
      )}

      <div
        className={`w-full rounded-xl border p-4 shadow-sm transition-all duration-200 ${getTypeStyles()}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
            {node.type}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            Step {index + 1}
          </span>
        </div>

        <h4 className="mb-2 text-sm font-medium text-slate-200 dark:text-slate-100">{node.name}</h4>

        <div className="mt-2 space-y-1.5 border-t border-slate-800/60 pt-2">
          {Object.entries(node.config).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">{key}:</span>
              <input
                type="text"
                className="max-w-[180px] rounded border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-right font-mono text-slate-200 focus:border-slate-600 focus:outline-none"
                value={value}
                onChange={(e) =>
                  onUpdateConfig?.(node.id, { ...node.config, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

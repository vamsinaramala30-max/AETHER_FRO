// frontend/src/automation/workflow-center/WorkflowNode.tsx
import React from 'react';
import { WorkflowNodeData } from './workflowservice';

interface WorkflowNodeProps {
  node: WorkflowNodeData;
  index: number;
  onUpdateConfig?: (id: string, config: Record<string, any>) => void;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ node, index, onUpdateConfig }) => {
  const getTypeStyles = () => {
    switch (node.type) {
      case 'trigger':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'condition':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'action':
        return 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400';
      default:
        return 'border-border bg-card text-foreground';
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      {index > 0 && <div className="bg-border my-1.5 h-8 w-0.5" />}

      <div
        className={`w-full rounded-2xl border p-4 shadow-sm transition-all duration-200 ${getTypeStyles()}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">{node.type}</span>
          <span className="border-border bg-background text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            Step {index + 1}
          </span>
        </div>

        <h4 className="text-foreground mb-2 text-sm font-bold">{node.name}</h4>

        <div className="border-border/60 mt-2 space-y-1.5 border-t pt-2">
          {Object.entries(node.config).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="text-muted-foreground font-mono text-[11px]">{key}:</span>
              <input
                type="text"
                className="border-border bg-background text-foreground w-full sm:w-auto sm:max-w-[180px] rounded-lg border px-2.5 py-1 text-left sm:text-right font-mono text-xs focus:border-indigo-500 focus:outline-none"
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

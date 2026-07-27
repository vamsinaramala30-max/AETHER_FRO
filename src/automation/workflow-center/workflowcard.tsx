// frontend/src/automation/workflow-center/WorkflowCard.tsx
import React from 'react';
import { Workflow } from './workflowService';

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: string) => void;
  onEdit: (workflow: Workflow) => void;
  onDelete: (id: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700/60">
      <div>
        <div className="mb-3 flex items-start justify-between">
          <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400">
            {workflow.triggerType}
          </span>
          <button
            onClick={() => {
              onToggle(workflow.id);
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              workflow.isActive ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                workflow.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <h3 className="mb-1.5 text-base font-semibold tracking-tight text-slate-200">
          {workflow.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {workflow.description}
        </p>
      </div>

      <div className="mt-auto space-y-3 border-t border-slate-800/60 pt-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Nodes: {workflow.nodes.length} structural steps</span>
          <span>
            {workflow.lastTriggeredAt
              ? `Executed: ${new Date(workflow.lastTriggeredAt).toLocaleDateString()}`
              : 'Never run'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              onEdit(workflow);
            }}
            className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-800"
          >
            Edit Layout
          </button>
          <button
            onClick={() => {
              onDelete(workflow.id);
            }}
            className="rounded border border-red-900/30 px-2.5 py-1 text-xs text-red-400 transition-colors hover:bg-red-950/20"
          >
            Purge
          </button>
        </div>
      </div>
    </div>
  );
};

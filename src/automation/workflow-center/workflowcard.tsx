// frontend/src/automation/workflow-center/WorkflowCard.tsx
import React from 'react';
import { Workflow } from './workflowService';

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: string) => void;
  onEdit: (workflow: Workflow) => void;
  onDelete: (id: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onToggle, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-slate-700/60 shadow-sm">
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {workflow.triggerType}
          </span>
          <button
            onClick={() => { onToggle(workflow.id); }}
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

        <h3 className="text-base font-semibold text-slate-200 tracking-tight mb-1.5">
          {workflow.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {workflow.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/60 mt-auto space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Nodes: {workflow.nodes.length} structural steps</span>
          <span>
            {workflow.lastTriggeredAt 
              ? `Executed: ${new Date(workflow.lastTriggeredAt).toLocaleDateString()}` 
              : 'Never run'}
          </span>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { onEdit(workflow); }}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Edit Layout
          </button>
          <button
            onClick={() => { onDelete(workflow.id); }}
            className="px-2.5 py-1 text-xs rounded border border-red-900/30 text-red-400 hover:bg-red-950/20 transition-colors"
          >
            Purge
          </button>
        </div>
      </div>
    </div>
  );
};
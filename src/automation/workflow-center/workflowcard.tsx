import React from 'react';
import { Workflow } from './workflowservice';
import { Trash2, Edit2 } from 'lucide-react';

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
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="mb-3 flex items-start justify-between">
          <span className="rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300">
            {workflow.triggerType}
          </span>
          <button
            onClick={() => onToggle(workflow.id)}
            className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              workflow.isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                workflow.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <h3 className="mb-1.5 text-base font-bold text-slate-900 dark:text-white">
          {workflow.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {workflow.description}
        </p>
      </div>

      <div className="mt-auto space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{workflow.nodes.length} steps</span>
          <span>
            {workflow.lastTriggeredAt
              ? `Executed: ${new Date(workflow.lastTriggeredAt).toLocaleDateString()}`
              : 'Never run'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(workflow)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(workflow.id)}
            className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

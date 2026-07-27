// frontend/src/automation/workflow-center/WorkflowBuilder.tsx
import React, { useState } from 'react';
import { Workflow, WorkflowNodeData } from './workflowservice';
import { WorkflowNode } from './workflownode';

interface WorkflowBuilderProps {
  workflow: Workflow;
  onSave: (updated: Workflow) => void;
  onCancel: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onSave, onCancel }) => {
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description);
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(workflow.nodes);

  const handleUpdateNodeConfig = (nodeId: string, newConfig: Record<string, any>) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, config: newConfig } : n)));
  };

  const handleAddNode = (type: 'action' | 'condition') => {
    const newNode: WorkflowNodeData = {
      id: `node-${Date.now()}`,
      type,
      name: type === 'action' ? 'New Executable Action' : 'Conditional Filter Rule',
      config:
        type === 'action' ? { system: 'AETHER-Core', target: 'Default' } : { rule: 'Expression' },
    };
    setNodes([...nodes, newNode]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...workflow,
      name,
      description,
      nodes,
    });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Workflow Designer</h2>
          <p className="text-xs text-slate-400">
            Configure orchestrations, conditional pathways, and direct operational steps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            type="button"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
          >
            Save Blueprint
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-4 border-r border-slate-800/60 pr-0 md:col-span-1 md:pr-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Blueprint Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition-colors focus:border-indigo-500 focus:outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Functional Objective
            </label>
            <textarea
              className="h-24 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition-colors focus:border-indigo-500 focus:outline-none"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="space-y-2 border-t border-slate-800/40 pt-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Append Execution Node
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAddNode('condition');
                }}
                className="rounded border border-amber-500/20 p-2 text-xs text-amber-400 transition-colors hover:bg-amber-500/10"
              >
                + Condition
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddNode('action');
                }}
                className="rounded border border-sky-500/20 p-2 text-xs text-sky-400 transition-colors hover:bg-sky-500/10"
              >
                + Action
              </button>
            </div>
          </div>
        </div>

        <div className="flex max-h-[500px] min-h-[400px] flex-col items-center justify-start overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/40 p-6 md:col-span-2">
          {nodes.length === 0 ? (
            <p className="my-auto text-sm text-slate-500">
              No operational blocks appended to this architectural sequence.
            </p>
          ) : (
            nodes.map((node, index) => (
              <WorkflowNode
                key={node.id}
                node={node}
                index={index}
                onUpdateConfig={handleUpdateNodeConfig}
              />
            ))
          )}
        </div>
      </form>
    </div>
  );
};

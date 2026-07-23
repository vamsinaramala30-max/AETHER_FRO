// frontend/src/automation/workflow-center/WorkflowBuilder.tsx
import React, { useState } from 'react';
import { Workflow, WorkflowNodeData } from './workflowService';
import { WorkflowNode } from './WorkflowNode';

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
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, config: newConfig } : n));
  };

  const handleAddNode = (type: 'action' | 'condition') => {
    const newNode: WorkflowNodeData = {
      id: `node-${Date.now()}`,
      type,
      name: type === 'action' ? 'New Executable Action' : 'Conditional Filter Rule',
      config: type === 'action' ? { system: 'AETHER-Core', target: 'Default' } : { rule: 'Expression' }
    };
    setNodes([...nodes, newNode]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...workflow,
      name,
      description,
      nodes
    });
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Workflow Designer</h2>
          <p className="text-xs text-slate-400">Configure orchestrations, conditional pathways, and direct operational steps.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm shadow-indigo-600/20 transition-colors"
          >
            Save Blueprint
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4 border-r border-slate-800/60 pr-0 md:pr-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Blueprint Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              value={name}
              onChange={(e) => { setName(e.target.value); }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Functional Objective</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 h-24 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
              value={description}
              onChange={(e) => { setDescription(e.target.value); }}
            />
          </div>

          <div className="pt-4 border-t border-slate-800/40 space-y-2">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Append Execution Node</h5>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { handleAddNode('condition'); }}
                className="p-2 text-xs rounded border border-amber-500/20 hover:bg-amber-500/10 text-amber-400 transition-colors"
              >
                + Condition
              </button>
              <button
                type="button"
                onClick={() => { handleAddNode('action'); }}
                className="p-2 text-xs rounded border border-sky-500/20 hover:bg-sky-500/10 text-sky-400 transition-colors"
              >
                + Action
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-950/40 rounded-xl p-6 border border-slate-800/80 flex flex-col items-center justify-start min-h-[400px] overflow-y-auto max-h-[500px]">
          {nodes.length === 0 ? (
            <p className="text-sm text-slate-500 my-auto">No operational blocks appended to this architectural sequence.</p>
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
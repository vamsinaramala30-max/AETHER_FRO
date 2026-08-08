import React, { useState } from 'react';
import { Workflow, WorkflowNodeData } from './workflowservice';
import { WorkflowNode } from './workflownode';
import { useNotificationStore } from '@/state/notificationStore';

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
    useNotificationStore.getState().addNotification({
      title: 'Workflow Saved',
      description: `Automation workflow "${name}" was updated with ${nodes.length} nodes.`,
      type: 'automation',
    });
  };

  return (
    <div className="border-border bg-card space-y-6 rounded-2xl border p-4 shadow-sm backdrop-blur-md transition-colors sm:p-6">
      <div className="border-border flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-lg font-bold sm:text-xl">Workflow Designer</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Configure orchestrations, conditional pathways, and direct operational steps.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={onCancel}
            type="button"
            className="border-border bg-secondary/50 text-foreground hover:bg-secondary rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/35"
          >
            Save Blueprint
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border-border/60 space-y-4 border-b pb-6 md:col-span-1 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-xs font-bold uppercase tracking-wider">
              Blueprint Name
            </label>
            <input
              type="text"
              required
              className="border-border bg-background text-foreground w-full rounded-xl border px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-xs font-bold uppercase tracking-wider">
              Functional Objective
            </label>
            <textarea
              className="border-border bg-background text-foreground h-28 w-full resize-none rounded-xl border px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="border-border/60 space-y-2 border-t pt-4">
            <h5 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Append Execution Node
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAddNode('condition');
                }}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs font-semibold text-amber-600 transition-all hover:bg-amber-500/20 dark:text-amber-400"
              >
                + Condition
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddNode('action');
                }}
                className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-2.5 text-xs font-semibold text-sky-600 transition-all hover:bg-sky-500/20 dark:text-sky-400"
              >
                + Action
              </button>
            </div>
          </div>
        </div>

        <div className="border-border bg-background/60 flex max-h-[600px] min-h-[350px] w-full flex-col items-center justify-start space-y-2 overflow-y-auto rounded-2xl border p-3 sm:p-6 md:col-span-2">
          {nodes.length === 0 ? (
            <p className="text-muted-foreground my-auto text-sm">
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

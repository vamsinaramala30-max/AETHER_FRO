// frontend/src/automation/workflow-center/WorkflowCenterPage.tsx
import React, { useEffect, useState } from 'react';
import { workflowService, Workflow } from './workflowservice';
import { WorkflowCard } from './workflowcard';
import { WorkflowBuilder } from './workflowbuilder';

export const WorkflowCenterPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getWorkflows();
      setWorkflows(data);
      setError(null);
    } catch {
      setError('Could not establish synchronization with core automation framework.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await workflowService.toggleWorkflow(id);
      setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
    } catch {
      setError('State transaction failed.');
    }
  };

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
  };

  const handleCreateNew = () => {
    const fresh: Workflow = {
      id: `wf-${Date.now()}`,
      name: 'Untitled Process Architecture',
      description: 'Describe the sequence objective.',
      isActive: false,
      triggerType: 'Manual Trigger',
      createdAt: new Date().toISOString(),
      nodes: [
        {
          id: `node-${Date.now()}`,
          type: 'trigger',
          name: 'Initialization Event',
          config: { origin: 'system' },
        },
      ],
    };
    setEditingWorkflow(fresh);
  };

  const handleSave = async (updatedWorkflow: Workflow) => {
    try {
      await workflowService.saveWorkflow(updatedWorkflow);
      setEditingWorkflow(null);
      fetchWorkflows();
    } catch {
      setError('Failed to persist the workflow layout changes.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirm immediate architectural destruction of this workflow context?'))
      return;
    try {
      await workflowService.deleteWorkflow(id);
      fetchWorkflows();
    } catch {
      setError('Failed to drop layout from infrastructure storage target.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-900/40 bg-red-950/40 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {editingWorkflow ? (
        <WorkflowBuilder
          workflow={editingWorkflow}
          onSave={handleSave}
          onCancel={() => {
            setEditingWorkflow(null);
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Workflow Matrix</h1>
              <p className="text-xs text-slate-400">
                Design, deploy, and inspect continuous reactive orchestration streams.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm shadow-indigo-600/10 transition-colors hover:bg-indigo-500"
            >
              + Create Blueprint
            </button>
          </div>

          {workflows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center">
              <p className="text-sm text-slate-500">
                No pipelines deployed inside this zone boundary.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

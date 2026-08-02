// frontend/src/automation/workflow-center/WorkflowCenterPage.tsx
import React, { useEffect, useState } from 'react';
import { workflowService, Workflow } from './workflowservice';
import { WorkflowCard } from './workflowcard';
import { WorkflowBuilder } from './workflowbuilder';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const WorkflowCenterPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getWorkflows();
      setWorkflows(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError('Could not establish synchronization with core automation framework.');
      setWorkflows([]);
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
      setWorkflows((prev) =>
        Array.isArray(prev) ? prev.map((w) => (w.id === id ? updated : w)) : [],
      );
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

  const safeWorkflows = Array.isArray(workflows) ? workflows : [];

  return (
    <PageWrapper>
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
        <div className="space-y-6">
          <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight">
                Workflow Center
              </h1>
              <p className="text-muted-foreground text-sm">
                Design, deploy, and inspect automated reactive orchestration pipelines.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
            >
              + Create Workflow
            </button>
          </div>

          {safeWorkflows.length === 0 ? (
            <div className="border-border bg-card rounded-2xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No active workflows created yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {safeWorkflows.map((workflow) => (
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
        </div>
      )}
    </PageWrapper>
  );
};

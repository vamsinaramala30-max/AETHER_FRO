// frontend/src/automation/workflow-center/workflowService.ts

export interface WorkflowNodeData {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: string;
  lastTriggeredAt?: string;
  createdAt: string;
  nodes: WorkflowNodeData[];
}

let mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'DevOps Pipeline Slack Alert',
    description: 'Triggered when a production deployment fails, alerts the on-call channel.',
    isActive: true,
    triggerType: 'Webhook',
    lastTriggeredAt: '2026-07-20T14:32:00Z',
    createdAt: '2026-01-15T08:00:00Z',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        name: 'Webhook Received',
        config: { path: '/v1/deploy-status' },
      },
      {
        id: 'node-2',
        type: 'condition',
        name: 'If Status == "failed"',
        config: { field: 'status', operand: 'failed' },
      },
      {
        id: 'node-3',
        type: 'action',
        name: 'Send Slack Notification',
        config: { channel: '#ops-alerts' },
      },
    ],
  },
  {
    id: 'wf-2',
    name: 'AI Lead Qualification sync',
    description:
      'Parses inbound contact forms via AETHER AI core and syncs qualified profiles to internal storage.',
    isActive: false,
    triggerType: 'CRM Event',
    lastTriggeredAt: '2026-07-18T09:11:00Z',
    createdAt: '2026-03-22T11:45:00Z',
    nodes: [
      {
        id: 'node-a',
        type: 'trigger',
        name: 'New Contact Form Submited',
        config: { source: 'website' },
      },
      {
        id: 'node-b',
        type: 'action',
        name: 'AETHER AI Enrichment',
        config: { model: 'aether-fast-v2' },
      },
      {
        id: 'node-c',
        type: 'action',
        name: 'Update Data Registry',
        config: { collection: 'leads' },
      },
    ],
  },
];

import { apiClient } from '../../api/client';

export const workflowService = {
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const res = await apiClient.get<any>('/workflows');
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && Array.isArray(res.automations)) return res.automations;
      return [...mockWorkflows];
    } catch {
      return [...mockWorkflows];
    }
  },

  async toggleWorkflow(id: string): Promise<Workflow> {
    try {
      const res = await apiClient.patch<any>(`/workflows/${id}/toggle`);
      return res?.data || res || mockWorkflows[0];
    } catch {
      const index = mockWorkflows.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error('Workflow not found');
      }
      mockWorkflows[index] = {
        ...mockWorkflows[index],
        isActive: !mockWorkflows[index].isActive,
      };
      return { ...mockWorkflows[index] };
    }
  },

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    try {
      if (workflow.id && !workflow.id.startsWith('wf-new-')) {
        const res = await apiClient.put<any>(`/workflows/${workflow.id}`, workflow);
        return res?.data || res || workflow;
      }
      const res = await apiClient.post<any>('/workflows', workflow);
      return res?.data || res || workflow;
    } catch {
      const index = mockWorkflows.findIndex((w) => w.id === workflow.id);
      if (index !== -1) {
        mockWorkflows[index] = { ...workflow };
      } else {
        mockWorkflows.push(workflow);
      }
      return { ...workflow };
    }
  },

  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/workflows/${id}`);
      return true;
    } catch {
      mockWorkflows = mockWorkflows.filter((w) => w.id !== id);
      return true;
    }
  },
};

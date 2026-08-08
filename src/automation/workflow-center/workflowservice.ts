import { apiClient } from '../../api/client';

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

export const workflowService = {
  async getWorkflows(): Promise<Workflow[]> {
    const normalize = (items: any[]): Workflow[] => {
      return items.map((item) => ({
        id: item.id || `wf-${Date.now()}`,
        name: item.name || 'Untitled Workflow',
        description: item.description || '',
        isActive: Boolean(item.isActive ?? item.isEnabled ?? false),
        triggerType: item.triggerType || item.trigger || 'Manual Trigger',
        lastTriggeredAt: item.lastTriggeredAt || item.lastRunAt,
        createdAt: item.createdAt || new Date().toISOString(),
        nodes: Array.isArray(item.nodes)
          ? item.nodes
          : Array.isArray(item.actions)
            ? item.actions
            : [
                {
                  id: `node-${Date.now()}`,
                  type: 'trigger',
                  name: item.trigger || 'Initialization Event',
                  config: {},
                },
              ],
      }));
    };

    try {
      const res = await apiClient.get<any>('/workflows');
      let rawList: any[] = [];
      if (Array.isArray(res)) rawList = res;
      else if (res && Array.isArray(res.data)) rawList = res.data;
      else if (res && Array.isArray(res.automations)) rawList = res.automations;

      return normalize(rawList);
    } catch {
      return [];
    }
  },

  async toggleWorkflow(id: string): Promise<Workflow> {
    const res = await apiClient.patch<any>(`/workflows/${id}/toggle`);
    return res?.data || res;
  },

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    if (workflow.id && !workflow.id.startsWith('wf-new-')) {
      const res = await apiClient.put<any>(`/workflows/${workflow.id}`, workflow);
      return res?.data || res || workflow;
    }
    const res = await apiClient.post<any>('/workflows', workflow);
    return res?.data || res || workflow;
  },

  async deleteWorkflow(id: string): Promise<boolean> {
    await apiClient.delete(`/workflows/${id}`);
    return true;
  },
};


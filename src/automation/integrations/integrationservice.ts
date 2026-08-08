// frontend/src/automation/integrations/integrationservice.ts
import { apiClient } from '../../api/client';

export interface Integration {
  id: string;
  name: string;
  category: 'Communication' | 'Cloud Storage' | 'DevOps' | 'Analytics';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt?: string;
  configSchema: string[];
}

export const integrationsService = {
  async getIntegrations(): Promise<Integration[]> {
    try {
      const res = await apiClient.get<any>('/integrations');
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      return items;
    } catch {
      return [];
    }
  },

  async updateIntegrationStatus(
    id: string,
    status: 'connected' | 'disconnected',
  ): Promise<Integration> {
    const res = await apiClient.patch<any>(`/integrations/${id}`, { status });
    return res?.data || res;
  },
};

// frontend/src/automation/integrations/integrationsService.ts

export interface Integration {
  id: string;
  name: string;
  category: 'Communication' | 'Cloud Storage' | 'DevOps' | 'Analytics';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt?: string;
  configSchema: string[];
}

const mockIntegrations: Integration[] = [
  {
    id: 'int-slack',
    name: 'Slack Workplace Sync',
    category: 'Communication',
    status: 'connected',
    lastSyncedAt: '2026-07-20T21:00:00Z',
    configSchema: ['Webhook URL', 'Default Channel'],
  },
  {
    id: 'int-aws',
    name: 'AWS S3 Bucket Gateway',
    category: 'Cloud Storage',
    status: 'connected',
    lastSyncedAt: '2026-07-20T19:44:00Z',
    configSchema: ['Access Key ID', 'Secret Identifier', 'Target Region'],
  },
  {
    id: 'int-github',
    name: 'GitHub Action Webhooks',
    category: 'DevOps',
    status: 'error',
    lastSyncedAt: '2026-07-19T08:12:00Z',
    configSchema: ['OAuth App Token', 'Repository Path'],
  },
  {
    id: 'int-linear',
    name: 'Linear Issue Tracking',
    category: 'DevOps',
    status: 'disconnected',
    configSchema: ['API Token Key'],
  },
];

import { apiClient } from '../../api/client';

export const integrationsService = {
  async getIntegrations(): Promise<Integration[]> {
    try {
      return await apiClient.get<Integration[]>('/integrations');
    } catch {
      return [...mockIntegrations];
    }
  },

  async updateIntegrationStatus(
    id: string,
    status: 'connected' | 'disconnected',
  ): Promise<Integration> {
    try {
      return await apiClient.patch<Integration>(`/integrations/${id}`, { status });
    } catch {
      const index = mockIntegrations.findIndex((i) => i.id === id);
      if (index !== -1) {
        mockIntegrations[index] = {
          ...mockIntegrations[index],
          status,
          lastSyncedAt: status === 'connected' ? new Date().toISOString() : undefined,
        };
        return { ...mockIntegrations[index] };
      }
      throw new Error('Integration entity not found');
    }
  },
};

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

export const integrationsService = {
  async getIntegrations(): Promise<Integration[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockIntegrations]);
      }, 300);
    });
  },

  async updateIntegrationStatus(
    id: string,
    status: 'connected' | 'disconnected',
  ): Promise<Integration> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockIntegrations.findIndex((i) => i.id === id);
        if (index === -1) {
          reject(new Error('Integration entity not found'));
          return;
        }
        mockIntegrations[index] = {
          ...mockIntegrations[index],
          status,
          lastSyncedAt: status === 'connected' ? new Date().toISOString() : undefined,
        };
        resolve({ ...mockIntegrations[index] });
      }, 250);
    });
  },
};

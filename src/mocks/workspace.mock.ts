export interface MockWorkspace {
  id: string;
  name: string;
  membersCount: number;
  plan: 'enterprise' | 'pro' | 'free';
}

export const mockWorkspace: MockWorkspace = {
  id: 'ws_aether_enterprise',
  name: 'AETHER Core Workspace',
  membersCount: 42,
  plan: 'enterprise',
};
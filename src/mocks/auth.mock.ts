export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'editor';
  token: string;
}

export const mockUser: MockUser = {
  id: 'usr_aether_999',
  email: 'architect@aether.ai',
  name: 'AETHER Architect',
  role: 'admin',
  token: 'mock-jwt-token-aether-prod-1029384756',
};

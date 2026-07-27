export interface MockChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export const mockAiMessages: MockChatMessage[] = [
  {
    id: 'msg_1',
    role: 'system',
    content: 'AETHER Core AI active and listening.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_2',
    role: 'user',
    content: 'Optimize the Three.js pipeline render graph.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg_3',
    role: 'assistant',
    content: 'InstancedMesh setup complete. Particle draw calls reduced to 1.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
];

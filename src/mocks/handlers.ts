import { mockUser } from './auth.mock';
import { mockAiMessages } from './ai.mock';
import { mockProjects } from './projects.mock';
import { mockWorkspace } from './workspace.mock';
import { mockKnowledgeDocs } from './knowledge.mock';
import { mockWorkflows } from './automation.mock';

export const mockApiEndpoints = {
  getAuthUser: () => ({ status: 200, data: mockUser }),
  getAiMessages: () => ({ status: 200, data: mockAiMessages }),
  getProjects: () => ({ status: 200, data: mockProjects }),
  getWorkspace: () => ({ status: 200, data: mockWorkspace }),
  getKnowledge: () => ({ status: 200, data: mockKnowledgeDocs }),
  getAutomation: () => ({ status: 200, data: mockWorkflows }),
};
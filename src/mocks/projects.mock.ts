export interface MockProject {
  id: string;
  title: string;
  status: 'active' | 'archived' | 'pending';
  updatedAt: string;
}

export const mockProjects: MockProject[] = [
  { id: 'proj_1', title: 'AETHER Neural Dashboard', status: 'active', updatedAt: new Date().toISOString() },
  { id: 'proj_2', title: 'Autonomous Pipeline Synthesizer', status: 'active', updatedAt: new Date().toISOString() },
  { id: 'proj_3', title: 'Legacy Analytics Importer', status: 'archived', updatedAt: new Date().toISOString() },
];
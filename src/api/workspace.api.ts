import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface WorkspaceDTO {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

export const workspaceApi = {
  getWorkspaces: (config?: RequestConfig): Promise<WorkspaceDTO[]> =>
    apiClient.get<WorkspaceDTO[]>(ENDPOINTS.WORKSPACE.BASE, config),

  getWorkspaceById: (id: string, config?: RequestConfig): Promise<WorkspaceDTO> =>
    apiClient.get<WorkspaceDTO>(ENDPOINTS.WORKSPACE.BY_ID(id), config),

  createWorkspace: (payload: { name: string; slug: string }, config?: RequestConfig): Promise<WorkspaceDTO> =>
    apiClient.post<WorkspaceDTO>(ENDPOINTS.WORKSPACE.BASE, payload, config),
};
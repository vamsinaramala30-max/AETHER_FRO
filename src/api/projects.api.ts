import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  workspaceId: string;
}

export const projectsApi = {
  getAll: (workspaceId: string, config?: RequestConfig): Promise<ProjectDTO[]> =>
    apiClient.get<ProjectDTO[]>(ENDPOINTS.PROJECTS.BASE, { ...config, params: { workspaceId, ...config?.params } }),

  getById: (id: string, config?: RequestConfig): Promise<ProjectDTO> =>
    apiClient.get<ProjectDTO>(ENDPOINTS.PROJECTS.BY_ID(id), config),

  create: (payload: CreateProjectPayload, config?: RequestConfig): Promise<ProjectDTO> =>
    apiClient.post<ProjectDTO>(ENDPOINTS.PROJECTS.BASE, payload, config),

  update: (id: string, payload: Partial<CreateProjectPayload>, config?: RequestConfig): Promise<ProjectDTO> =>
    apiClient.patch<ProjectDTO>(ENDPOINTS.PROJECTS.BY_ID(id), payload, config),

  delete: (id: string, config?: RequestConfig): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.PROJECTS.BY_ID(id), config),
};
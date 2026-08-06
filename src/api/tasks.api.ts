import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface TaskDTO {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  assigneeId?: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId?: string;
  status?: TaskDTO['status'];
  priority?: TaskDTO['priority'];
  dueDate?: string;
  assigneeIds?: string[];
  labels?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskDTO['status'];
  priority?: TaskDTO['priority'];
  dueDate?: string;
  assigneeIds?: string[];
  labels?: string[];
}

export interface ApiListDataResponse<T> {
  data: T[];
  total?: number;
  page?: number;
}

export interface ApiDataResponse<T> {
  data: T;
}

export const tasksApi = {
  getAll: (
    params?: { projectId?: string; status?: string; assigneeId?: string },
    config?: RequestConfig,
  ): Promise<ApiListDataResponse<TaskDTO>> =>
    apiClient.get<ApiListDataResponse<TaskDTO>>(ENDPOINTS.TASKS.BASE, {
      ...config,
      params: params as Record<string, string>,
    }),

  getById: (id: string, config?: RequestConfig): Promise<ApiDataResponse<TaskDTO>> =>
    apiClient.get<ApiDataResponse<TaskDTO>>(ENDPOINTS.TASKS.BY_ID(id), config),

  create: (payload: CreateTaskPayload, config?: RequestConfig): Promise<ApiDataResponse<TaskDTO>> =>
    apiClient.post<ApiDataResponse<TaskDTO>>(ENDPOINTS.TASKS.BASE, payload, config),

  update: (
    id: string,
    payload: UpdateTaskPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<TaskDTO>> =>
    apiClient.put<ApiDataResponse<TaskDTO>>(ENDPOINTS.TASKS.BY_ID(id), payload, config),

  patch: (
    id: string,
    payload: UpdateTaskPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<TaskDTO>> =>
    apiClient.patch<ApiDataResponse<TaskDTO>>(ENDPOINTS.TASKS.BY_ID(id), payload, config),

  delete: (id: string, config?: RequestConfig): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.TASKS.BY_ID(id), config),
};

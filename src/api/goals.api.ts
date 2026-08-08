import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface GoalDTO {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  targetDate?: string;
  progress?: number;
  status?: GoalDTO['status'];
  category?: string;
  workspaceId?: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  targetDate?: string;
  status?: GoalDTO['status'];
  category?: string;
}

export interface ApiListDataResponse<T> {
  data: T[];
  total?: number;
}

export interface ApiDataResponse<T> {
  data: T;
}

export const goalsApi = {
  getAll: (
    params?: { userId?: string; status?: string },
    config?: RequestConfig,
  ): Promise<ApiListDataResponse<GoalDTO>> =>
    apiClient.get<ApiListDataResponse<GoalDTO>>(ENDPOINTS.GOALS.BASE, {
      ...config,
      params: params as Record<string, string>,
    }),

  getById: (id: string, config?: RequestConfig): Promise<ApiDataResponse<GoalDTO>> =>
    apiClient.get<ApiDataResponse<GoalDTO>>(ENDPOINTS.GOALS.BY_ID(id), config),

  create: (payload: CreateGoalPayload, config?: RequestConfig): Promise<ApiDataResponse<GoalDTO>> =>
    apiClient.post<ApiDataResponse<GoalDTO>>(ENDPOINTS.GOALS.BASE, payload, config),

  update: (
    id: string,
    payload: UpdateGoalPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<GoalDTO>> =>
    apiClient.put<ApiDataResponse<GoalDTO>>(ENDPOINTS.GOALS.BY_ID(id), payload, config),

  updateProgress: (
    id: string,
    progress: number,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<GoalDTO>> =>
    apiClient.patch<ApiDataResponse<GoalDTO>>(ENDPOINTS.GOALS.PROGRESS(id), { progress }, config),

  delete: (id: string, config?: RequestConfig): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.GOALS.BY_ID(id), config),
};

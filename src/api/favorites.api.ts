import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface FavoriteDTO {
  id: string;
  userId: string;
  workspaceId?: string | null;
  resourceType: string;
  resourceId: string;
  title: string;
  metadata?: Record<string, unknown> | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddFavoritePayload {
  title: string;
  resourceType: string;
  resourceId: string;
  workspaceId?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export const favoritesApi = {
  getAll: (config?: RequestConfig): Promise<ApiListResponse<FavoriteDTO>> =>
    apiClient.get<ApiListResponse<FavoriteDTO>>(ENDPOINTS.FAVORITES.BASE, config),

  add: (payload: AddFavoritePayload, config?: RequestConfig): Promise<ApiItemResponse<FavoriteDTO>> =>
    apiClient.post<ApiItemResponse<FavoriteDTO>>(ENDPOINTS.FAVORITES.BASE, payload, config),

  remove: (id: string, config?: RequestConfig): Promise<{ success: boolean; message: string }> =>
    apiClient.delete<{ success: boolean; message: string }>(ENDPOINTS.FAVORITES.BY_ID(id), config),

  removeByResource: (
    resourceType: string,
    resourceId: string,
    config?: RequestConfig,
  ): Promise<{ success: boolean; message: string }> =>
    apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.FAVORITES.BY_RESOURCE(resourceType, resourceId),
      config,
    ),

  reorder: (orderedIds: string[], config?: RequestConfig): Promise<{ success: boolean; message: string }> =>
    apiClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.FAVORITES.REORDER,
      { orderedIds },
      config,
    ),
};

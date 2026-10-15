import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface KnowledgeDocumentDTO {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface SearchKnowledgeParams {
  query: string;
  tags?: string[];
  limit?: number;
}

export const knowledgeApi = {
  search: async (
    params: SearchKnowledgeParams,
    config?: RequestConfig,
  ): Promise<KnowledgeDocumentDTO[]> => {
    const res = await apiClient.get<any>(ENDPOINTS.KNOWLEDGE.SEARCH, {
      ...config,
      params: { query: params.query, tags: params.tags?.join(','), limit: params.limit },
    });
    return Array.isArray(res) ? res : (res?.data || res?.results || []);
  },

  getById: async (id: string, config?: RequestConfig): Promise<KnowledgeDocumentDTO> => {
    const res = await apiClient.get<any>(ENDPOINTS.KNOWLEDGE.BY_ID(id), config);
    return res?.data ?? res;
  },

  create: async (
    payload: Omit<KnowledgeDocumentDTO, 'id' | 'createdAt'>,
    config?: RequestConfig,
  ): Promise<KnowledgeDocumentDTO> => {
    const res = await apiClient.post<any>(ENDPOINTS.KNOWLEDGE.BASE, payload, config);
    return res?.data ?? res;
  },

  delete: (id: string, config?: RequestConfig): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.KNOWLEDGE.BY_ID(id), config),
};

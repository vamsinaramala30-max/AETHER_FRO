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
  search: (
    params: SearchKnowledgeParams,
    config?: RequestConfig,
  ): Promise<KnowledgeDocumentDTO[]> =>
    apiClient.get<KnowledgeDocumentDTO[]>(ENDPOINTS.KNOWLEDGE.SEARCH, {
      ...config,
      params: { query: params.query, tags: params.tags?.join(','), limit: params.limit },
    }),

  getById: (id: string, config?: RequestConfig): Promise<KnowledgeDocumentDTO> =>
    apiClient.get<KnowledgeDocumentDTO>(ENDPOINTS.KNOWLEDGE.BY_ID(id), config),

  create: (
    payload: Omit<KnowledgeDocumentDTO, 'id' | 'createdAt'>,
    config?: RequestConfig,
  ): Promise<KnowledgeDocumentDTO> =>
    apiClient.post<KnowledgeDocumentDTO>(ENDPOINTS.KNOWLEDGE.BASE, payload, config),

  delete: (id: string, config?: RequestConfig): Promise<void> =>
    apiClient.delete<void>(ENDPOINTS.KNOWLEDGE.BY_ID(id), config),
};

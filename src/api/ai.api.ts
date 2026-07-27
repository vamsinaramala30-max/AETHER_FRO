import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface ChatMessageDTO {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiChatPayload {
  model: string;
  messages: ChatMessageDTO[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AiChatResponse {
  id: string;
  message: ChatMessageDTO;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AiModelDTO {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
}

export const aiApi = {
  sendMessage: (payload: AiChatPayload, config?: RequestConfig): Promise<AiChatResponse> =>
    apiClient.post<AiChatResponse>(ENDPOINTS.AI.CHAT, payload, config),

  streamMessage: (
    payload: AiChatPayload,
    config?: RequestConfig,
  ): AsyncGenerator<string, void, unknown> =>
    apiClient.stream(ENDPOINTS.AI.STREAM, {
      ...config,
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getModels: (config?: RequestConfig): Promise<AiModelDTO[]> =>
    apiClient.get<AiModelDTO[]>(ENDPOINTS.AI.MODELS, config),
};

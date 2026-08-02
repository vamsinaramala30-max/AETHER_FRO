import { apiClient } from '../../api/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface Conversation {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface AssistantConfig {
  temperature: number;
  model: string;
  systemPrompt?: string;
}

class AssistantService {
  public async sendMessage(
    conversationId: string,
    content: string,
    config?: Partial<AssistantConfig>,
  ): Promise<Message> {
    const rawResponse = await apiClient.post<{ data: any }>('/ai/chat', {
      conversationId,
      content,
      message: content,
      model: config?.model,
      temperature: config?.temperature,
    });

    const data = rawResponse.data || rawResponse;

    return {
      id: data.id || crypto.randomUUID(),
      role: data.role || 'assistant',
      content: data.content || '',
      timestamp: data.createdAt || new Date().toISOString(),
      tokensUsed: data.metadata?.totalTokens || Math.ceil((data.content || '').length / 4),
    };
  }

  public async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const res = await apiClient.get<{ data: any }>(`/ai/conversations/${conversationId}`);
      const data = res.data || res;
      if (!data || !Array.isArray(data.messages)) return [];

      return data.messages.map((m: any) => ({
        id: m.id || crypto.randomUUID(),
        role: m.role || 'assistant',
        content: m.content || '',
        timestamp: m.createdAt || new Date().toISOString(),
        tokensUsed: m.metadata?.totalTokens,
      }));
    } catch {
      return [];
    }
  }
}

export const assistantService = new AssistantService();

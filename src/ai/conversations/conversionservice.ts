import { Conversation } from '../assistant/assistantservice';
import { apiClient } from '../../api/client';

class ConversationService {
  private baseRoute = '/ai/conversations';

  public async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<Conversation[] | { data: Conversation[] }>(this.baseRoute);
      const data = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
          ? (response as any).data
          : [];
      return data;
    } catch (err) {
      console.error('[ConversationService] getConversations error:', err);
      return [];
    }
  }

  public async createConversation(title: string): Promise<Conversation> {
    const response = await apiClient.post<Conversation | { data: Conversation }>(this.baseRoute, {
      title,
    });
    const created = (response as any)?.data || response;
    return created;
  }
}

export const conversationService = new ConversationService();

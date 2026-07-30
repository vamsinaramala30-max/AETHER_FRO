import { Conversation } from '../assistant/assistantservice';
import { api } from '../../shared/api';

class ConversationService {
  private baseRoute = '/ai/conversations';
  private storageKey = 'aether_conversations_registry';

  public async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get<Conversation[] | { data: Conversation[] }>(this.baseRoute);
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      if (data.length > 0) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
      return data;
    } catch {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }
  }

  public async createConversation(title: string): Promise<Conversation> {
    const fresh: Conversation = {
      id: `conv_${crypto.randomUUID()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    try {
      const response = await api.post<Conversation | { data: Conversation }>(this.baseRoute, { title });
      const created = (response.data as any)?.data || response.data || fresh;
      const current = await this.getConversations();
      localStorage.setItem(this.storageKey, JSON.stringify([created, ...current]));
      return created;
    } catch {
      const current = await this.getConversations();
      const updated = [fresh, ...current];
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return fresh;
    }
  }
}

export const conversationService = new ConversationService();

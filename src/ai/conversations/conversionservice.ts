import { Conversation } from '../assistant/assistantService';

class ConversationService {
  private baseRoute = '/api/v1/ai/conversations';
  private fallbackKey = 'aether_conversations_registry';

  private mockRegistry: Conversation[] = [
    {
      id: 'default_session',
      title: 'Global Context Orchestrator',
      summary: 'Primary development hub sync session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 4,
    },
    {
      id: 'conv_2',
      title: 'Refactoring Knowledge Abstraction',
      summary: 'Isolating data pipelines for vector indexes',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      messageCount: 12,
    },
  ];

  public async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(this.baseRoute);
      if (!response.ok) throw new Error('Network error parsing sessions');
      return await response.json();
    } catch {
      const stored = localStorage.getItem(this.fallbackKey);
      if (!stored) {
        localStorage.setItem(this.fallbackKey, JSON.stringify(this.mockRegistry));
        return this.mockRegistry;
      }
      return JSON.parse(stored);
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
      const response = await fetch(this.baseRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      const current = await this.getConversations();
      const updated = [fresh, ...current];
      localStorage.setItem(this.fallbackKey, JSON.stringify(updated));
      return fresh;
    }
  }
}

export const conversationService = new ConversationService();

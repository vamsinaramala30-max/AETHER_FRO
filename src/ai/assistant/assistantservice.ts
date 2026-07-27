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
  private baseRoute = '/api/v1/ai/assistant';

  // Fallback storage key if backend session persistence is not yet established
  private fallbackKey = 'aether_fallback_messages';

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('aether_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  public async sendMessage(
    conversationId: string,
    content: string,
    config?: Partial<AssistantConfig>,
  ): Promise<Message> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseRoute}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ conversationId, content, config }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend endpoint offline. Initiating client-side safe emulation layer.', error);
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResponse: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `I received your message: "${content}". This is a highly responsive local processing fallback layer. Connect your live streaming or REST pipeline seamlessly to ${this.baseRoute}/chat.`,
            timestamp: new Date().toISOString(),
            tokensUsed: content.length / 4 + 20,
          };
          resolve(mockResponse);
        }, 1000);
      });
    }
  }

  public async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseRoute}/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) throw new Error('Failed to retrieve messages');
      return await response.json();
    } catch {
      const stored = localStorage.getItem(`${this.fallbackKey}_${conversationId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  public saveFallbackMessages(conversationId: string, messages: Message[]): void {
    localStorage.setItem(`${this.fallbackKey}_${conversationId}`, JSON.stringify(messages));
  }
}

export const assistantService = new AssistantService();

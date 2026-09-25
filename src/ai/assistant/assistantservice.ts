import { apiClient } from '../../api/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokensUsed?: number;
  status?: 'sending' | 'sent' | 'streaming' | 'delivered' | 'error';
  error?: string;
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
  temperature?: number;
  model?: string;
  systemPrompt?: string;
}

export interface StreamEventCallbacks {
  onChunk?: (delta: string) => void;
  onStatus?: (status: string, toolName?: string) => void;
  onError?: (error: Error) => void;
  onComplete?: (fullText: string) => void;
}

class AssistantService {
  /**
   * Send a standard non-streaming message to the backend AI assistant.
   */
  public async sendMessage(
    conversationId: string,
    content: string,
    config?: Partial<AssistantConfig>,
    signal?: AbortSignal,
  ): Promise<Message> {
    const rawResponse = await apiClient.post<any>('/ai/chat', {
      conversationId,
      content,
      message: content,
      model: config?.model || 'default',
      temperature: config?.temperature ?? 0.7,
    }, { signal });

    const data = rawResponse?.data?.data || rawResponse?.data || rawResponse;

    const messageContent =
      data?.content ||
      data?.message?.content ||
      data?.response ||
      (typeof data === 'string' ? data : '');

    return {
      id: data?.id || crypto.randomUUID(),
      role: data?.role || 'assistant',
      content: messageContent,
      timestamp: data?.createdAt || new Date().toISOString(),
      tokensUsed:
        data?.metadata?.totalTokens ||
        data?.usage?.totalTokens ||
        Math.ceil((messageContent || '').length / 4),
    };
  }

  /**
   * Stream message token by token using SSE from backend /ai/stream.
   */
  public async streamMessage(
    conversationId: string,
    content: string,
    callbacks: StreamEventCallbacks,
    config?: Partial<AssistantConfig>,
    signal?: AbortSignal,
  ): Promise<string> {
    const payload = {
      conversationId,
      message: content,
      content,
      model: config?.model || 'default',
      temperature: config?.temperature ?? 0.7,
      options: {
        streaming: true,
        modelId: config?.model || 'default',
      },
    };

    let accumulatedText = '';
    let terminalStatus: string | null = null;

    try {
      const streamGenerator = apiClient.stream('/ai/stream', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal,
      });

      for await (const chunkString of streamGenerator) {
        if (!chunkString || chunkString === '[DONE]') {
          break;
        }

        let parsed: any = null;
        try {
          parsed = JSON.parse(chunkString);
        } catch {
          // If chunk is raw text delta
          if (chunkString && !chunkString.startsWith('{') && !chunkString.startsWith('[')) {
            accumulatedText += chunkString;
            callbacks.onChunk?.(chunkString);
          }
          continue;
        }

        if (parsed.error) {
          const err = new Error(
            typeof parsed.error === 'string'
              ? parsed.error
              : parsed.error.message || 'Stream processing error',
          );
          callbacks.onError?.(err);
          throw err;
        }

        if (parsed.delta) {
          accumulatedText += parsed.delta;
          callbacks.onChunk?.(parsed.delta);
        }

        if (parsed.status && parsed.status !== 'streaming') {
          callbacks.onStatus?.(parsed.status, parsed.toolName);
        }

        if (parsed.isLast || parsed.done) {
          terminalStatus = parsed.status || (parsed.done ? 'completed' : null);
          if (parsed.status === 'failed') {
            const err = new Error(
              typeof parsed.error === 'string'
                ? parsed.error
                : parsed.details || 'Stream execution failed',
            );
            callbacks.onError?.(err);
            throw err;
          }
          if (parsed.status === 'cancelled') {
            const err = new Error('Stream execution was cancelled');
            (err as any).name = 'AbortError';
            throw err;
          }
          break;
        }
      }

      if (terminalStatus === 'failed') {
        throw new Error('Stream execution failed');
      }
      if (terminalStatus === 'cancelled' || signal?.aborted) {
        const abortErr = new Error('Stream was cancelled');
        abortErr.name = 'AbortError';
        throw abortErr;
      }

      callbacks.onComplete?.(accumulatedText);
      return accumulatedText;
    } catch (err) {
      if ((err as any)?.name === 'AbortError' || signal?.aborted) {
        callbacks.onStatus?.('cancelled');
        throw err;
      }
      callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Retrieve conversation history from backend persistence.
   */
  public async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const res = await apiClient.get<any>(`/ai/conversations/${conversationId}/messages`);
      const payload = res?.data?.data || res?.data || res;
      if (!Array.isArray(payload)) return [];

      return payload.map((m: any) => ({
        id: m.id || crypto.randomUUID(),
        role: m.role || 'assistant',
        content: m.content || '',
        timestamp: m.createdAt || new Date().toISOString(),
        tokensUsed: m.metadata?.totalTokens || m.tokens,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fetch conversation list from backend.
   */
  public async listConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get<any>('/ai/conversations');
      const payload = res?.data?.data || res?.data || res;
      if (!Array.isArray(payload)) return [];

      return payload.map((c: any) => ({
        id: c.id,
        title: c.title || 'Untitled Conversation',
        summary: c.summary,
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.updatedAt || new Date().toISOString(),
        messageCount: typeof c.messageCount === 'number' ? c.messageCount : (c.messages?.length || 0),
      }));
    } catch {
      return [];
    }
  }
}

export const assistantService = new AssistantService();


// ============================================================================
// AETHER AI — AI Service (Primary Orchestration Service)
// ============================================================================
// Isolates all backend AI communication. UI components do not call fetch directly.
// ============================================================================

import type {
  AIConversation,
  AIMessage,
  GenerationResponse,
  StreamingSession,
  AIContext,
  AIResult,
  AIError,
  ThinkingStatus,
} from '../ai-types';
import { aiEngine } from '../core/ai-engine';
import { conversationStore } from '../conversations/conversation-store';
import { messageStore } from '../conversations/message-store';
import { createUserMessage } from '../conversations/conversation-types';
import { useAIStore } from '../ai-store';

export interface SendMessageOptions {
  conversationId: string;
  content: string;
  stream?: boolean;
  onChunk?: (delta: string, messageId: string) => void;
  onThinkingUpdate?: (status: ThinkingStatus, toolName?: string) => void;
  onComplete?: (response: GenerationResponse) => void;
  onError?: (error: AIError) => void;
  onSessionCreated?: (session: StreamingSession) => void;
}

/**
 * AIService is the unified frontend AI service.
 * All AI operations flow through this service.
 * UI components consume this via hooks, not directly.
 */
export class AIService {
  /**
   * Create a new conversation via the backend.
   */
  async createConversation(title = 'New Conversation'): Promise<AIResult<AIConversation>> {
    return conversationStore.create(title);
  }

  /**
   * Load all conversations.
   */
  async listConversations(): Promise<AIResult<AIConversation[]>> {
    return conversationStore.list();
  }

  /**
   * Load messages for a conversation.
   */
  async loadMessages(conversationId: string): Promise<AIResult<AIMessage[]>> {
    return messageStore.list(conversationId);
  }

  /**
   * Delete a conversation.
   */
  async deleteConversation(id: string): Promise<AIResult<void>> {
    return conversationStore.delete(id);
  }

  /**
   * Rename a conversation.
   */
  async renameConversation(id: string, title: string): Promise<AIResult<AIConversation>> {
    return conversationStore.rename(id, title);
  }

  /**
   * Send a message and get a response.
   * Supports streaming and non-streaming modes.
   */
  async sendMessage(opts: SendMessageOptions): Promise<void> {
    const store = useAIStore.getState();

    // Build user message for immediate display
    const userMsg = createUserMessage(opts.conversationId, opts.content);

    // Add user message to store immediately for optimistic UI
    store.appendMessage(opts.conversationId, {
      ...userMsg,
      status: 'sent',
    });

    // Retrieve user ID from auth state/storage
    let userId = 'user_default';
    try {
      const authRaw = localStorage.getItem('aether-auth-storage');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        userId = parsed?.state?.user?.id || parsed?.state?.userId || 'user_default';
      }
    } catch {
      // Fallback if unavailable
    }

    // Build AI context from current store state
    const messages = store.messages[opts.conversationId] ?? [];
    const context: AIContext = {
      conversationId: opts.conversationId,
      userId,
      messages,
      activeModel: store.activeModel,
      intent: null,
      ragContext: store.activeRAGContext,
      memoryEntries: store.memoryEntries,
      activeAgent: store.activeAgent,
      systemPrompt: null,
      metadata: {},
    };

    if (opts.stream !== false) {
      // Streaming mode
      const session = await aiEngine.streamGenerate(context, opts.content, {
        onThinkingUpdate: opts.onThinkingUpdate,
        onChunk: opts.onChunk,
        onComplete: opts.onComplete,
        onError: opts.onError,
        onSessionCreated: opts.onSessionCreated,
      });

      if (session) {
        store.setStreamingSession(session);
      }
    } else {
      // Non-streaming mode
      await aiEngine.generate(context, opts.content, {
        onThinkingUpdate: opts.onThinkingUpdate,
        onComplete: opts.onComplete,
        onError: opts.onError,
      });
    }
  }

  /**
   * Stop active streaming.
   */
  stopStreaming(): void {
    const store = useAIStore.getState();
    const session = store.streamingSession;
    if (session) {
      session.abortController.abort();
      store.setStreamingSession(null);
      store.setStreamingStatus('cancelled');
    }
  }

  /**
   * Check AI backend health.
   */
  async checkHealth(): Promise<boolean> {
    return aiEngine.checkHealth();
  }
}

export const aiService = new AIService();

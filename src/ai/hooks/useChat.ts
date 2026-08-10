// ============================================================================
// AETHER AI — useChat Hook
// ============================================================================

import { useCallback, useEffect, useRef } from 'react';
import { useAIStore } from '../ai-store';
import { aiService } from '../services/ai-service';
import { buildThinkingState } from '../core/reasoning-engine';
import type {
  AIConversation,
  AIMessage,
  StreamingStatus,
  ThinkingState,
  AIError,
  GenerationResponse,
} from '../ai-types';

export interface UseChatReturn {
  // State
  conversations: Record<string, AIConversation>;
  activeConversationId: string | null;
  activeConversation: AIConversation | null;
  messages: AIMessage[];
  streamingStatus: StreamingStatus;
  thinkingState: ThinkingState | null;
  error: AIError | null;
  isStreaming: boolean;
  isLoading: boolean;

  // Actions
  createConversation: (title?: string) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  clearError: () => void;
}

/**
 * useChat — Chat state and message actions for the active conversation.
 */
export function useChat(): UseChatReturn {
  const conversations = useAIStore((s) => s.conversations);
  const activeConversationId = useAIStore((s) => s.activeConversationId);
  const messages = useAIStore((s) =>
    activeConversationId ? (s.messages[activeConversationId] ?? []) : [],
  );
  const streamingStatus = useAIStore((s) => s.streamingStatus);
  const thinkingState = useAIStore((s) => s.thinkingState);
  const error = useAIStore((s) => s.error);

  const store = useAIStore.getState;
  const setActiveConversationId = useAIStore((s) => s.setActiveConversationId);
  const setConversations = useAIStore((s) => s.setConversations);
  const upsertConversation = useAIStore((s) => s.upsertConversation);
  const removeConversation = useAIStore((s) => s.removeConversation);
  const renameConv = useAIStore((s) => s.renameConversation);
  const setMessages = useAIStore((s) => s.setMessages);
  const appendMessage = useAIStore((s) => s.appendMessage);
  const updateMessage = useAIStore((s) => s.updateMessage);
  const appendStreamingChunk = useAIStore((s) => s.appendStreamingChunk);
  const setStreamingStatus = useAIStore((s) => s.setStreamingStatus);
  const setThinkingState = useAIStore((s) => s.setThinkingState);
  const setStreamingSession = useAIStore((s) => s.setStreamingSession);
  const setError = useAIStore((s) => s.setError);
  const clearError = useAIStore((s) => s.clearError);

  const activeConversation = activeConversationId
    ? (conversations[activeConversationId] ?? null)
    : null;

  const isStreaming =
    streamingStatus === 'streaming' || streamingStatus === 'starting';
  const isLoading = streamingStatus === 'starting';

  // Load conversations on mount
  useEffect(() => {
    let cancelled = false;
    void aiService.listConversations().then((result) => {
      if (cancelled || !result.success) return;
      const convMap: Record<string, AIConversation> = {};
      for (const c of result.data) convMap[c.id] = c;
      setConversations(convMap);
    });
    return () => { cancelled = true; };
  }, [setConversations]);

  const createConversation = useCallback(
    async (title = 'New Conversation') => {
      const result = await aiService.createConversation(title);
      if (!result.success) {
        setError(result.error);
        return;
      }
      upsertConversation(result.data);
      setActiveConversationId(result.data.id);
    },
    [upsertConversation, setActiveConversationId, setError],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id);
      // Load messages if not already cached
      const currentMessages = store().messages[id];
      if (!currentMessages) {
        const result = await aiService.loadMessages(id);
        if (result.success) {
          setMessages(id, result.data);
        }
      }
    },
    [setActiveConversationId, setMessages, store],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      const result = await aiService.deleteConversation(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      removeConversation(id);
    },
    [removeConversation, setError],
  );

  const renameConversation = useCallback(
    async (id: string, title: string) => {
      const result = await aiService.renameConversation(id, title);
      if (!result.success) {
        setError(result.error);
        return;
      }
      renameConv(id, title);
    },
    [renameConv, setError],
  );

  const streamingMessageIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const convId = activeConversationId;
      if (!convId || !content.trim() || isStreaming) return;

      clearError();
      setStreamingStatus('starting');
      streamingMessageIdRef.current = null;

      await aiService.sendMessage({
        conversationId: convId,
        content,
        stream: true,
        onThinkingUpdate: (status, toolName) => {
          setThinkingState(buildThinkingState(status as never, toolName));
        },
        onSessionCreated: (session) => {
          setStreamingStatus('streaming');
          setStreamingSession(session);
          streamingMessageIdRef.current = session.messageId;
          // Add streaming placeholder message
          appendMessage(convId, {
            id: session.messageId,
            conversationId: convId,
            role: 'assistant',
            content: '',
            status: 'streaming',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        },
        onChunk: (delta, messageId) => {
          appendStreamingChunk(convId, messageId, delta);
        },
        onComplete: (response: GenerationResponse) => {
          setStreamingStatus('completed');
          setThinkingState(null);
          setStreamingSession(null);
          if (streamingMessageIdRef.current) {
            updateMessage(convId, streamingMessageIdRef.current, {
              content: response.content,
              status: 'delivered',
              citations: response.citations,
              toolInvocations: response.toolInvocations,
              tokens: response.usage
                ? {
                    prompt: response.usage.promptTokens,
                    completion: response.usage.completionTokens,
                    total: response.usage.totalTokens,
                  }
                : undefined,
            });
          }
        },
        onError: (err) => {
          setStreamingStatus('failed');
          setThinkingState(null);
          setStreamingSession(null);
          setError(err);
          if (streamingMessageIdRef.current) {
            updateMessage(convId, streamingMessageIdRef.current, {
              status: 'error',
              error: err.message,
            });
          }
        },
      });
    },
    [
      activeConversationId,
      isStreaming,
      clearError,
      setStreamingStatus,
      setThinkingState,
      setStreamingSession,
      appendMessage,
      appendStreamingChunk,
      updateMessage,
      setError,
    ],
  );

  const stopGeneration = useCallback(() => {
    aiService.stopStreaming();
    setStreamingStatus('cancelled');
    setThinkingState(null);
  }, [setStreamingStatus, setThinkingState]);

  return {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    streamingStatus,
    thinkingState,
    error,
    isStreaming,
    isLoading,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
    stopGeneration,
    clearError,
  };
}

// ============================================================================
// AETHER AI — AI Engine (Central Frontend Abstraction)
// ============================================================================
// Provides the single unified entry point for all AI operations.
// Delegates to orchestrator, streaming engine, and response engine.
// ============================================================================

import type {
  AIContext,
  GenerationResponse,
  StreamingSession,
  AIMessage,
  AIError,
} from '../ai-types';
import { aiOrchestrator, type ThinkingUpdateHandler } from './ai-orchestrator';
import { streamingEngine } from './streaming-engine';
import { responseEngine } from './response-engine';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { useAIStore } from '../ai-store';

let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface AIEngineStreamCallbacks {
  onThinkingUpdate?: ThinkingUpdateHandler;
  onChunk?: (delta: string, messageId: string) => void;
  onComplete?: (response: GenerationResponse) => void;
  onError?: (error: AIError) => void;
  onSessionCreated?: (session: StreamingSession) => void;
}

export interface AIEngineRequestCallbacks {
  onThinkingUpdate?: ThinkingUpdateHandler;
  onComplete?: (response: GenerationResponse) => void;
  onError?: (error: AIError) => void;
}

/**
 * AIEngine is the central frontend AI entry point.
 * It does NOT run an LLM itself — it orchestrates requests to the AETHER backend.
 */
export class AIEngine {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Send a streaming generation request.
   * Returns the streaming session for cancellation.
   */
  async streamGenerate(
    context: AIContext,
    userMessage: string,
    callbacks: AIEngineStreamCallbacks,
  ): Promise<StreamingSession | null> {
    // Validate message
    const validationResult = aiOrchestrator.validateUserMessage(userMessage);
    if (!validationResult.success) {
      callbacks.onError?.(validationResult.error);
      return null;
    }

    // Prepare the generation request via orchestrator
    const orchestrationResult = aiOrchestrator.prepareRequest({
      context,
      userMessage: validationResult.data,
      stream: true,
      onThinkingUpdate: callbacks.onThinkingUpdate,
    });

    if (!orchestrationResult.success) {
      callbacks.onError?.(orchestrationResult.error);
      return null;
    }

    const { request } = orchestrationResult.data;
    const messageId = generateMessageId();
    const sessionId = generateSessionId();
    const abortController = streamingEngine.createAbortController();

    const session = streamingEngine.createSession(
      sessionId,
      context.conversationId,
      messageId,
      abortController,
    );

    callbacks.onSessionCreated?.(session);

    const endpoint = `${this.config.backend.baseUrl}${this.config.backend.streamPath}`;

    // Build the streaming message shell (placeholder)
    const shellMessage: AIMessage = responseEngine.buildStreamingMessageShell(
      messageId,
      context.conversationId,
    );

    let accumulatedContent = '';

    // Start streaming
    streamingEngine
      .startStream({
        sessionId,
        conversationId: context.conversationId,
        messageId,
        endpoint,
        payload: {
          conversation_id: request.conversationId,
          messages: request.messages,
          model_id: request.modelId,
          providerMode: useAIStore.getState().providerMode,
          system_prompt: request.systemPrompt,
          rag_context: request.ragContext,
          stream: true,
        },
        signal: abortController.signal,
        onChunk: (chunk) => {
          accumulatedContent += chunk.delta;
          callbacks.onChunk?.(chunk.delta, messageId);
        },
        onComplete: (finalContent) => {
          const response: GenerationResponse = {
            messageId,
            conversationId: context.conversationId,
            content: finalContent || accumulatedContent,
            role: 'assistant',
            finishReason: 'stop',
            generatedAt: Date.now(),
            modelId: request.modelId,
          };
          callbacks.onComplete?.(response);
        },
        onError: (error) => {
          callbacks.onError?.(error);
        },
      })
      .catch(() => {
        // The startStream error is handled via onError callback
      });

    // Suppress unused variable warning — shellMessage is returned conceptually
    void shellMessage;

    return session;
  }

  /**
   * Send a non-streaming generation request.
   */
  async generate(
    context: AIContext,
    userMessage: string,
    callbacks: AIEngineRequestCallbacks,
  ): Promise<void> {
    const validationResult = aiOrchestrator.validateUserMessage(userMessage);
    if (!validationResult.success) {
      callbacks.onError?.(validationResult.error);
      return;
    }

    const orchestrationResult = aiOrchestrator.prepareRequest({
      context,
      userMessage: validationResult.data,
      stream: false,
      onThinkingUpdate: callbacks.onThinkingUpdate,
    });

    if (!orchestrationResult.success) {
      callbacks.onError?.(orchestrationResult.error);
      return;
    }

    const { request } = orchestrationResult.data;
    const endpoint = `${this.config.backend.baseUrl}${this.config.backend.chatPath}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: request.conversationId,
          messages: request.messages,
          model_id: request.modelId,
          providerMode: useAIStore.getState().providerMode,
          system_prompt: request.systemPrompt,
          rag_context: request.ragContext,
          stream: false,
        }),
        signal: AbortSignal.timeout(this.config.backend.timeoutMs),
      });

      if (!res.ok) {
        const error = responseEngine.normalizeGenerationResponse(
          {},
          context.conversationId,
        );
        if (!error.success) {
          callbacks.onError?.(error.error);
        }
        return;
      }

      const raw = (await res.json()) as Record<string, unknown>;
      const normalized = responseEngine.normalizeGenerationResponse(
        raw,
        context.conversationId,
      );
      if (!normalized.success) {
        callbacks.onError?.(normalized.error);
        return;
      }

      callbacks.onComplete?.(normalized.data);
    } catch {
      callbacks.onError?.({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Cannot reach the AETHER AI backend.',
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Check backend AI health.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.config.backend.baseUrl}${this.config.backend.healthPath}`,
        { signal: AbortSignal.timeout(5_000) },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const aiEngine = new AIEngine();

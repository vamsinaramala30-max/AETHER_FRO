// ============================================================================
// AETHER AI — AI Orchestrator
// ============================================================================
// Coordinates intent → context → memory → RAG → LLM → tools → agents → response
// ============================================================================

import type { AIContext, GenerationRequest, AIResult, ThinkingStatus } from '../ai-types';
import { aiFailure } from '../ai-types';
import { contextEngine } from './context-engine';
import { reasoningEngine } from './reasoning-engine';

export type ThinkingUpdateHandler = (status: ThinkingStatus, toolName?: string) => void;

export interface OrchestratorRequest {
  context: AIContext;
  userMessage: string;
  stream?: boolean;
  onThinkingUpdate?: ThinkingUpdateHandler;
}

export interface OrchestratorResult {
  request: GenerationRequest;
  thinkingSequence: ThinkingStatus[];
}

/**
 * AIOrchestrator determines the generation request shape
 * based on the intent, context, memory, and RAG state.
 *
 * The actual LLM call is delegated to the backend via the AI service.
 * This orchestrator never calls external AI APIs directly.
 */
export class AIOrchestrator {
  /**
   * Prepare a GenerationRequest from the orchestrated context.
   * Emits thinking status updates as it progresses.
   */
  prepareRequest(opts: OrchestratorRequest): AIResult<OrchestratorResult> {
    const { context, userMessage, stream = true, onThinkingUpdate } = opts;

    const thinkingSequence: ThinkingStatus[] = [];

    const emitThinking = (status: ThinkingStatus, toolName?: string): void => {
      thinkingSequence.push(status);
      onThinkingUpdate?.(status, toolName);
    };

    // Step 1: Intent analysis
    emitThinking('thinking');
    const intent = context.intent ?? contextEngine.buildIntent(userMessage);

    // Step 2: Memory context
    if (intent.requiresMemory && context.memoryEntries.length > 0) {
      emitThinking('thinking');
    }

    // Step 3: RAG retrieval (if needed)
    if (intent.requiresRAG) {
      emitThinking('retrieving');
    }

    // Step 4: Agent planning (if needed)
    if (intent.requiresAgent && context.activeAgent) {
      emitThinking('planning');
    }

    // Step 5: Generation
    emitThinking('generating');

    // Build formatted messages for the backend
    const formattedHistory = contextEngine.formatMessagesForBackend(context.messages);

    // Build the system prompt
    let systemPrompt = context.systemPrompt ?? '';

    // Inject memory context into system prompt if present
    if (context.memoryEntries.length > 0) {
      const memoryBlock = context.memoryEntries
        .slice(0, 10)
        .map((e) => e.content)
        .join('\n');
      systemPrompt = systemPrompt
        ? `${systemPrompt}\n\n[User Memory Context]\n${memoryBlock}`
        : `[User Memory Context]\n${memoryBlock}`;
    }

    // Validate model availability
    if (!context.activeModel) {
      return aiFailure('MODEL_UNAVAILABLE', 'No AI model is currently active.');
    }

    if (context.activeModel.status !== 'available' && context.activeModel.status !== 'loaded') {
      return aiFailure(
        'MODEL_UNAVAILABLE',
        `Model "${context.activeModel.name}" is not ready (status: ${context.activeModel.status}).`,
      );
    }

    const request: GenerationRequest = {
      conversationId: context.conversationId,
      messages: formattedHistory,
      modelId: context.activeModel.id,
      stream,
      systemPrompt: systemPrompt || undefined,
      ragContext: context.ragContext ?? undefined,
    };

    return {
      success: true,
      data: { request, thinkingSequence },
    };
  }

  /**
   * Validate a user message before orchestration.
   */
  validateUserMessage(message: string): AIResult<string> {
    const trimmed = message.trim();
    if (!trimmed) {
      return aiFailure('INVALID_REQUEST', 'Message cannot be empty.');
    }
    if (trimmed.length > 32_000) {
      return aiFailure('CONTEXT_TOO_LARGE', 'Message exceeds the maximum allowed length.');
    }
    return { success: true, data: trimmed };
  }
}

export const aiOrchestrator = new AIOrchestrator();

// Re-export for convenience
export { reasoningEngine };

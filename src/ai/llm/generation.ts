// ============================================================================
// AETHER AI — Generation (Frontend Request Builder)
// ============================================================================
// Utilities for building and validating generation requests.
// ============================================================================

import type {
  GenerationRequest,
  GenerationResponse,
  AIMessage,
  MessageRole,
} from '../ai-types';

export interface MessageInput {
  role: MessageRole;
  content: string;
}

/**
 * Build a minimal GenerationRequest.
 */
export function buildGenerationRequest(
  conversationId: string,
  messages: MessageInput[],
  options?: {
    modelId?: string;
    systemPrompt?: string;
    stream?: boolean;
    maxTokens?: number;
    temperature?: number;
    signal?: AbortSignal;
  },
): GenerationRequest {
  return {
    conversationId,
    messages,
    modelId: options?.modelId,
    stream: options?.stream ?? true,
    maxTokens: options?.maxTokens,
    temperature: options?.temperature,
    systemPrompt: options?.systemPrompt,
    signal: options?.signal,
  };
}

/**
 * Convert AIMessage list to MessageInput list for generation.
 */
export function aiMessagesToInputs(messages: AIMessage[]): MessageInput[] {
  return messages
    .filter((m) => m.status !== 'error' && m.status !== 'cancelled' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Validate a GenerationResponse has required fields.
 */
export function isValidGenerationResponse(value: unknown): value is GenerationResponse {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r['messageId'] === 'string' &&
    typeof r['conversationId'] === 'string' &&
    typeof r['content'] === 'string' &&
    r['role'] === 'assistant'
  );
}

export const generation = {
  buildGenerationRequest,
  aiMessagesToInputs,
  isValidGenerationResponse,
};

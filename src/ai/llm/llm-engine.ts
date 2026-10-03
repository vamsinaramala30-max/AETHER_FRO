// ============================================================================
// AETHER AI — LLM Engine (Frontend Abstraction)
// ============================================================================
// Provider-independent frontend types and request coordination for LLM access.
// The frontend does NOT execute an LLM. Requests go to the AETHER backend.
// ============================================================================

import type { AIModelInfo, GenerationRequest, GenerationResponse, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { apiClient, ApiError } from '../../api/client';

/**
 * Represents the runtime capability of an LLM endpoint.
 */
export interface LLMCapabilities {
  streaming: boolean;
  tools: boolean;
  vision: boolean;
  rag: boolean;
  maxContextWindow: number;
  maxOutputTokens: number;
}

/**
 * Represents a backend LLM endpoint descriptor.
 */
export interface LLMEndpoint {
  id: string;
  name: string;
  baseUrl: string;
  modelId: string;
  capabilities: LLMCapabilities;
  healthy: boolean;
  lastCheckedAt?: number;
}

/**
 * Build a GenerationRequest for the backend.
 * The frontend never constructs LLM prompts from raw data —
 * the backend handles prompt engineering.
 */
export function buildLLMRequest(
  partial: Omit<GenerationRequest, 'stream'> & { stream?: boolean },
): GenerationRequest {
  return {
    ...partial,
    stream: partial.stream ?? true,
  };
}

/**
 * Frontend LLM Engine — coordinates request shaping and endpoint selection.
 * Does NOT execute inference locally.
 */
export class LLMEngine {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Request generation from the AETHER backend LLM runtime via authenticated apiClient.
   */
  async requestGeneration(request: GenerationRequest): Promise<AIResult<GenerationResponse>> {
    const endpoint = request.stream
      ? this.config.backend.streamPath
      : this.config.backend.chatPath;

    try {
      const raw = await apiClient.post<any>(
        endpoint,
        {
          conversation_id: request.conversationId,
          conversationId: request.conversationId,
          messages: request.messages,
          message: request.messages[request.messages.length - 1]?.content,
          model_id: request.modelId,
          modelId: request.modelId,
          system_prompt: request.systemPrompt,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
          stream: request.stream ?? false,
        },
        {
          signal: request.signal,
          timeout: this.config.backend.timeoutMs,
        },
      );

      const data = raw?.data ?? raw;
      return {
        success: true,
        data: {
          messageId: data.id ?? data.messageId ?? `msg_${Date.now()}`,
          conversationId: data.conversationId ?? request.conversationId,
          content: data.content ?? data.message?.content ?? '',
          role: 'assistant',
          finishReason: (data.finish_reason ?? data.finishReason ?? 'stop') as GenerationResponse['finishReason'],
          modelId: data.model ?? data.modelId ?? request.modelId,
          generatedAt: Date.now(),
          usage: data.usage
            ? {
                promptTokens: data.usage.prompt_tokens ?? data.usage.promptTokens ?? 0,
                completionTokens: data.usage.completion_tokens ?? data.usage.completionTokens ?? 0,
                totalTokens: data.usage.total_tokens ?? data.usage.totalTokens ?? 0,
              }
            : undefined,
        },
      };
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        return {
          success: false,
          error: {
            code:
              err.status === 401
                ? 'UNAUTHORIZED'
                : err.status === 503
                  ? 'SERVICE_UNAVAILABLE'
                  : 'GENERATION_FAILED',
            message: err.message || `LLM request failed with HTTP ${err.status}`,
            timestamp: Date.now(),
          },
        };
      }
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: err instanceof Error ? err.message : 'Cannot reach the AETHER LLM backend.',
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Select the best available model from the list.
   */
  selectBestModel(models: AIModelInfo[]): AIModelInfo | null {
    const available = models.filter((m) => m.status === 'available' || m.status === 'loaded');
    if (available.length === 0) return null;
    // Prefer loaded models
    const loaded = available.find((m) => m.status === 'loaded');
    return loaded ?? available[0] ?? null;
  }
}

export const llmEngine = new LLMEngine();

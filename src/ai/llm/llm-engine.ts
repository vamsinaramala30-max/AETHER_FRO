// ============================================================================
// AETHER AI — LLM Engine (Frontend Abstraction)
// ============================================================================
// Provider-independent frontend types and request coordination for LLM access.
// The frontend does NOT execute an LLM. Requests go to the AETHER backend.
// ============================================================================

import type { AIModelInfo, GenerationRequest, GenerationResponse, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

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
   * Request generation from the AETHER backend LLM runtime.
   */
  async requestGeneration(request: GenerationRequest): Promise<AIResult<GenerationResponse>> {
    const endpoint = request.stream
      ? `${this.config.backend.baseUrl}${this.config.backend.streamPath}`
      : `${this.config.backend.baseUrl}${this.config.backend.chatPath}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: request.conversationId,
          messages: request.messages,
          model_id: request.modelId,
          system_prompt: request.systemPrompt,
          max_tokens: request.maxTokens,
          temperature: request.temperature,
          stream: request.stream ?? false,
        }),
        signal: request.signal ?? AbortSignal.timeout(this.config.backend.timeoutMs),
      });

      if (!res.ok) {
        return {
          success: false,
          error: {
            code: res.status === 503 ? 'SERVICE_UNAVAILABLE' : 'GENERATION_FAILED',
            message: `LLM request failed with HTTP ${res.status}`,
            timestamp: Date.now(),
          },
        };
      }

      const raw = await res.json() as {
        id?: string;
        content?: string;
        finish_reason?: string;
        model?: string;
        usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      };

      return {
        success: true,
        data: {
          messageId: raw.id ?? `msg_${Date.now()}`,
          conversationId: request.conversationId,
          content: raw.content ?? '',
          role: 'assistant',
          finishReason: raw.finish_reason as GenerationResponse['finishReason'],
          modelId: raw.model ?? request.modelId,
          generatedAt: Date.now(),
          usage: raw.usage
            ? {
                promptTokens: raw.usage.prompt_tokens ?? 0,
                completionTokens: raw.usage.completion_tokens ?? 0,
                totalTokens: raw.usage.total_tokens ?? 0,
              }
            : undefined,
        },
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot reach the AETHER LLM backend.',
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Select the best available model from the list.
   */
  selectBestModel(models: AIModelInfo[]): AIModelInfo | null {
    const available = models.filter(
      (m) => m.status === 'available' || m.status === 'loaded',
    );
    if (available.length === 0) return null;
    // Prefer loaded models
    const loaded = available.find((m) => m.status === 'loaded');
    return loaded ?? available[0] ?? null;
  }
}

export const llmEngine = new LLMEngine();

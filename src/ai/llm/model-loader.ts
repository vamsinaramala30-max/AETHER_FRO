// ============================================================================
// AETHER AI — Model Loader (Frontend Abstraction)
// ============================================================================
// Represents load/unload request state for models managed by the AETHER backend.
// The frontend does NOT load model weights — it requests the backend to do so.
// ============================================================================

import type { AIModelInfo, AIResult, ModelStatus } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

export type LoadModelResult = AIResult<AIModelInfo>;

/**
 * Request the backend to load a model into the runtime.
 */
export async function requestModelLoad(modelId: string): Promise<LoadModelResult> {
  const url = `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.modelsPath}/${encodeURIComponent(modelId)}/load`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(DEFAULT_AI_CONFIG.backend.timeoutMs),
    });
    if (!res.ok) {
      return {
        success: false,
        error: {
          code: 'MODEL_LOAD_FAILED',
          message: `Failed to load model "${modelId}": HTTP ${res.status}`,
          timestamp: Date.now(),
        },
      };
    }
    const raw = await res.json() as Record<string, unknown>;
    return { success: true, data: normalizeModelInfo(raw) };
  } catch {
    return {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Cannot reach the AETHER backend to load model.',
        timestamp: Date.now(),
      },
    };
  }
}

/**
 * Request the backend to unload a model from the runtime.
 */
export async function requestModelUnload(modelId: string): Promise<AIResult<void>> {
  const url = `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.modelsPath}/${encodeURIComponent(modelId)}/unload`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return {
        success: false,
        error: {
          code: 'MODEL_LOAD_FAILED',
          message: `Failed to unload model "${modelId}": HTTP ${res.status}`,
          timestamp: Date.now(),
        },
      };
    }
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Cannot reach the AETHER backend to unload model.',
        timestamp: Date.now(),
      },
    };
  }
}

/**
 * Normalize a raw backend model payload into an AIModelInfo.
 */
export function normalizeModelInfo(raw: Record<string, unknown>): AIModelInfo {
  const validStatuses: ModelStatus[] = ['available', 'loading', 'loaded', 'unloading', 'unavailable', 'error'];
  const rawStatus = raw['status'] as string;
  const status: ModelStatus = validStatuses.includes(rawStatus as ModelStatus)
    ? (rawStatus as ModelStatus)
    : 'unavailable';

  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : 'unknown',
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Model',
    description: typeof raw['description'] === 'string' ? raw['description'] : undefined,
    runtime: (raw['runtime'] as AIModelInfo['runtime']) ?? 'unknown',
    status,
    contextWindow: typeof raw['context_window'] === 'number' ? raw['context_window'] : undefined,
    maxTokens: typeof raw['max_tokens'] === 'number' ? raw['max_tokens'] : undefined,
    supportsStreaming: raw['supports_streaming'] !== false,
    supportsTools: raw['supports_tools'] === true,
    supportsRAG: raw['supports_rag'] === true,
    supportsVision: raw['supports_vision'] === true,
    parametersB: typeof raw['parameters_b'] === 'number' ? raw['parameters_b'] : undefined,
    quantization: typeof raw['quantization'] === 'string' ? raw['quantization'] : undefined,
    family: typeof raw['family'] === 'string' ? raw['family'] : undefined,
    loadedAt: typeof raw['loaded_at'] === 'number' ? raw['loaded_at'] : undefined,
  };
}

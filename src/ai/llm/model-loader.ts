// ============================================================================
// AETHER AI — Model Loader (Frontend Abstraction)
// ============================================================================
// Normalizes model descriptors managed by the authoritative AETHER backend.
// ============================================================================

import type { AIModelInfo, ModelStatus } from '../ai-types';

/**
 * Normalize a raw backend model payload into an AIModelInfo.
 */
export function normalizeModelInfo(raw: Record<string, unknown>): AIModelInfo {
  const validStatuses: ModelStatus[] = [
    'available',
    'loading',
    'loaded',
    'unloading',
    'unavailable',
    'error',
  ];
  const rawStatus = raw['status'] as string;
  const status: ModelStatus =
    rawStatus && validStatuses.includes(rawStatus as ModelStatus)
      ? (rawStatus as ModelStatus)
      : 'available';

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

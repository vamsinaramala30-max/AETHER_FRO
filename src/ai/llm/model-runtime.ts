// ============================================================================
// AETHER AI — Model Runtime (Frontend Abstraction)
// ============================================================================

import type { AIModelInfo, ModelStatus, ModelRuntimeType } from '../ai-types';

/**
 * Frontend representation of a model runtime instance.
 */
export interface ModelRuntimeInfo {
  runtimeId: string;
  type: ModelRuntimeType;
  name: string;
  version?: string;
  healthy: boolean;
  loadedModels: string[];
  maxConcurrentRequests: number;
  activeRequests: number;
  lastHealthCheckAt?: number;
}

/**
 * Build a ModelRuntimeInfo from raw backend data.
 */
export function buildModelRuntimeInfo(raw: Record<string, unknown>): ModelRuntimeInfo {
  return {
    runtimeId: typeof raw['runtime_id'] === 'string' ? raw['runtime_id'] : 'unknown',
    type: (raw['type'] as ModelRuntimeType) ?? 'unknown',
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Runtime',
    version: typeof raw['version'] === 'string' ? raw['version'] : undefined,
    healthy: raw['healthy'] === true,
    loadedModels: Array.isArray(raw['loaded_models']) ? (raw['loaded_models'] as string[]) : [],
    maxConcurrentRequests: typeof raw['max_concurrent'] === 'number' ? raw['max_concurrent'] : 1,
    activeRequests: typeof raw['active_requests'] === 'number' ? raw['active_requests'] : 0,
    lastHealthCheckAt:
      typeof raw['last_health_check'] === 'number' ? raw['last_health_check'] : undefined,
  };
}

/**
 * Determine if a model can accept new requests.
 */
export function isModelReady(model: AIModelInfo, runtime: ModelRuntimeInfo | null): boolean {
  if (!runtime || !runtime.healthy) return false;
  if (model.status !== 'available' && model.status !== 'loaded') return false;
  return runtime.activeRequests < runtime.maxConcurrentRequests;
}

/**
 * Get a descriptive status label for a model.
 */
export function getModelStatusLabel(status: ModelStatus): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'loading':
      return 'Loading…';
    case 'loaded':
      return 'Loaded';
    case 'unloading':
      return 'Unloading…';
    case 'unavailable':
      return 'Unavailable';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}

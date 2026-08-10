// ============================================================================
// AETHER AI — Model Manager (Frontend Abstraction)
// ============================================================================
// Coordinates model listing, selection, load/unload, and status polling.
// ============================================================================

import type { AIModelInfo, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { normalizeModelInfo, requestModelLoad, requestModelUnload } from './model-loader';

export class ModelManager {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Fetch all available models from the AETHER backend.
   */
  async listModels(): Promise<AIResult<AIModelInfo[]>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.modelsPath}`;
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(this.config.backend.timeoutMs),
      });
      if (!res.ok) {
        return {
          success: false,
          error: {
            code: 'MODEL_UNAVAILABLE',
            message: `Failed to fetch models: HTTP ${res.status}`,
            timestamp: Date.now(),
          },
        };
      }
      const raw = await res.json() as { models?: unknown[] } | unknown[];
      const rawList = Array.isArray(raw) ? raw : (raw as { models?: unknown[] }).models ?? [];
      const models = rawList
        .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
        .map(normalizeModelInfo);
      return { success: true, data: models };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot reach the AETHER backend to list models.',
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Fetch a single model by ID.
   */
  async getModel(modelId: string): Promise<AIResult<AIModelInfo>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.modelsPath}/${encodeURIComponent(modelId)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: {
            code: 'MODEL_UNAVAILABLE',
            message: `Model "${modelId}" not found.`,
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
          message: 'Cannot fetch model details.',
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Request load of a specific model.
   */
  async loadModel(modelId: string): ReturnType<typeof requestModelLoad> {
    return requestModelLoad(modelId);
  }

  /**
   * Request unload of a specific model.
   */
  async unloadModel(modelId: string): ReturnType<typeof requestModelUnload> {
    return requestModelUnload(modelId);
  }

  /**
   * Find the best ready model from a list.
   */
  selectActive(models: AIModelInfo[]): AIModelInfo | null {
    const loaded = models.find((m) => m.status === 'loaded');
    if (loaded) return loaded;
    const available = models.find((m) => m.status === 'available');
    return available ?? null;
  }
}

export const modelManager = new ModelManager();

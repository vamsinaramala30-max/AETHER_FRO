// ============================================================================
// AETHER AI — Model Manager (Frontend Abstraction)
// ============================================================================
// Coordinates model listing, selection, load/unload, and status polling.
// ============================================================================

import type { AIModelInfo, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { normalizeModelInfo, requestModelLoad, requestModelUnload } from './model-loader';
import { apiClient } from '../../api/client';
import { useAIStore } from '../ai-store';

export class ModelManager {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Fetch all available models from the AETHER backend.
   */
  async listModels(): Promise<AIResult<AIModelInfo[]>> {
    try {
      const res = await apiClient.get<any>(this.config.backend.modelsPath, {
        timeout: this.config.backend.timeoutMs,
      });
      const rawList = Array.isArray(res) ? res : (res?.data ?? res?.models ?? []);
      const models = rawList
        .filter((m: any): m is Record<string, unknown> => typeof m === 'object' && m !== null)
        .map(normalizeModelInfo);

      if (models.length > 0) {
        useAIStore.getState().setAvailableModels(models);
        const active = this.selectActive(models);
        if (active) {
          useAIStore.getState().setActiveModel(active);
        }
      }

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

  async loadModels(): Promise<AIResult<AIModelInfo[]>> {
    return this.listModels();
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
      const raw = (await res.json()) as Record<string, unknown>;
      const rawData = (raw as any)?.data ?? raw;
      return { success: true, data: normalizeModelInfo(rawData) };
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
    if (!models || models.length === 0) return null;
    const loaded = models.find((m) => m.status === 'loaded');
    if (loaded) return loaded;
    const available = models.find((m) => m.status === 'available');
    if (available) return available;
    const authoritative = models.find((m) => m.id.includes('authoritative') || m.id === 'default');
    if (authoritative) return authoritative;
    return models[0] ?? null;
  }

  getActive(): AIModelInfo | null {
    return useAIStore.getState().activeModel;
  }
}

export const modelManager = new ModelManager();

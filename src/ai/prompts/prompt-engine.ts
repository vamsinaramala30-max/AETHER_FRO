// ============================================================================
// AETHER AI — Prompt Engine
// ============================================================================
// Manages prompt templates and builds prompts for different AI tasks.
// ============================================================================

import type { PromptTemplate, BuiltPrompt, PromptCategory, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

/**
 * PromptEngine coordinates prompt listing, selection, and building.
 */
export class PromptEngine {
  private readonly config = DEFAULT_AI_CONFIG;

  /**
   * Fetch all available prompts from the AETHER backend.
   */
  async listPrompts(category?: PromptCategory): Promise<AIResult<PromptTemplate[]>> {
    const url = category
      ? `${this.config.backend.baseUrl}${this.config.backend.promptsPath}?category=${category}`
      : `${this.config.backend.baseUrl}${this.config.backend.promptsPath}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to load prompts.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((p): p is Record<string, unknown> => typeof p === 'object' && p !== null)
          .map(normalizePromptTemplate),
      };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load prompts.', timestamp: Date.now() },
      };
    }
  }

  /**
   * Fetch a single prompt by ID.
   */
  async getPrompt(id: string): Promise<AIResult<PromptTemplate>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.promptsPath}/${encodeURIComponent(id)}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Prompt not found.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizePromptTemplate(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot fetch prompt.', timestamp: Date.now() },
      };
    }
  }
}

function normalizePromptTemplate(raw: Record<string, unknown>): PromptTemplate {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `prompt_${Date.now()}`,
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unnamed Prompt',
    description: typeof raw['description'] === 'string' ? raw['description'] : undefined,
    category: (raw['category'] as PromptTemplate['category']) ?? 'custom',
    template: typeof raw['template'] === 'string' ? raw['template'] : '',
    variables: Array.isArray(raw['variables'])
      ? raw['variables'].flatMap((v) => {
          if (typeof v !== 'object' || v === null) return [];
          const vr = v as Record<string, unknown>;
          return [{
            name: typeof vr['name'] === 'string' ? vr['name'] : '',
            description: typeof vr['description'] === 'string' ? vr['description'] : undefined,
            required: vr['required'] === true,
            defaultValue: typeof vr['default'] === 'string' ? vr['default'] : undefined,
          }];
        })
      : [],
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    isBuiltIn: raw['is_built_in'] === true,
  };
}

export { normalizePromptTemplate };
export const promptEngine = new PromptEngine();

// ============================================================================
// AETHER AI — Tool Registry
// ============================================================================
// Frontend registry of available tools from the AETHER backend.
// ============================================================================

import type { ToolDefinition, ToolCategory, AIResult, ToolRegistryStatus } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

function normalizeToolDefinition(raw: Record<string, unknown>): ToolDefinition {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `tool_${Date.now()}`,
    name: typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Tool',
    description: typeof raw['description'] === 'string' ? raw['description'] : '',
    category: (raw['category'] as ToolCategory) ?? 'system',
    parameters: Array.isArray(raw['parameters'])
      ? raw['parameters'].flatMap((p) => {
          if (typeof p !== 'object' || p === null) return [];
          const pr = p as Record<string, unknown>;
          return [{
            name: typeof pr['name'] === 'string' ? pr['name'] : '',
            type: (pr['type'] as ToolDefinition['parameters'][number]['type']) ?? 'string',
            description: typeof pr['description'] === 'string' ? pr['description'] : undefined,
            required: pr['required'] === true,
            enum: Array.isArray(pr['enum']) ? (pr['enum'] as string[]) : undefined,
          }];
        })
      : [],
    requiresAuth: raw['requires_auth'] === true,
    enabled: raw['enabled'] !== false,
  };
}

/**
 * ToolRegistry fetches and manages the list of available tools.
 */
export class ToolRegistry {
  private readonly config = DEFAULT_AI_CONFIG;
  private tools: ToolDefinition[] = [];

  async load(): Promise<AIResult<ToolDefinition[]>> {
    const url = `${this.config.backend.baseUrl}${this.config.backend.toolsPath}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to load tools.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      this.tools = raw
        .filter((t): t is Record<string, unknown> => typeof t === 'object' && t !== null)
        .map(normalizeToolDefinition);
      return { success: true, data: this.tools };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load tool registry.', timestamp: Date.now() },
      };
    }
  }

  getAll(): ToolDefinition[] {
    return this.tools;
  }

  getByCategory(category: ToolCategory): ToolDefinition[] {
    return this.tools.filter((t) => t.category === category);
  }

  getById(id: string): ToolDefinition | undefined {
    return this.tools.find((t) => t.id === id);
  }

  getStatus(): ToolRegistryStatus {
    const enabled = this.tools.filter((t) => t.enabled);
    const categories = [...new Set(this.tools.map((t) => t.category))];
    return {
      totalTools: this.tools.length,
      enabledTools: enabled.length,
      disabledTools: this.tools.length - enabled.length,
      categories,
    };
  }
}

export { normalizeToolDefinition };
export const toolRegistry = new ToolRegistry();

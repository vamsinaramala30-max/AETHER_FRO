// ============================================================================
// AETHER AI — Tool Registry
// ============================================================================
// Frontend registry of available tools from the AETHER backend.
// ============================================================================

import type { ToolDefinition, ToolCategory, AIResult, ToolRegistryStatus } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

import { apiClient } from '../../api/client';

function normalizeToolDefinition(raw: Record<string, unknown>): ToolDefinition {
  let category: ToolCategory = 'system';
  const cat = String(raw['category'] || '').toLowerCase();
  if (cat === 'task' || cat === 'tasks') category = 'task';
  else if (cat === 'project' || cat === 'projects') category = 'project';
  else if (cat === 'knowledge') category = 'knowledge';
  else if (cat === 'workspace' || cat === 'calendar') category = 'workspace';
  else if (cat === 'system') category = 'system';

  let parameters: ToolDefinition['parameters'] = [];
  if (Array.isArray(raw['parameters'])) {
    parameters = raw['parameters'].flatMap((p) => {
      if (typeof p !== 'object' || p === null) return [];
      const pr = p as Record<string, unknown>;
      return [
        {
          name: typeof pr['name'] === 'string' ? pr['name'] : '',
          type: (pr['type'] as ToolDefinition['parameters'][number]['type']) ?? 'string',
          description: typeof pr['description'] === 'string' ? pr['description'] : undefined,
          required: pr['required'] === true,
          enum: Array.isArray(pr['enum']) ? (pr['enum'] as string[]) : undefined,
        },
      ];
    });
  } else if (raw['inputSchema'] && typeof raw['inputSchema'] === 'object') {
    const schema = raw['inputSchema'] as Record<string, unknown>;
    const props = (schema['properties'] && typeof schema['properties'] === 'object')
      ? (schema['properties'] as Record<string, Record<string, unknown>>)
      : {};
    const requiredList = Array.isArray(schema['required']) ? (schema['required'] as string[]) : [];

    parameters = Object.entries(props).map(([propName, propDef]) => ({
      name: propName,
      type: (typeof propDef?.type === 'string' && ['string', 'number', 'boolean', 'object', 'array'].includes(propDef.type))
        ? (propDef.type as ToolDefinition['parameters'][number]['type'])
        : 'string',
      description: typeof propDef?.description === 'string' ? propDef.description : undefined,
      required: requiredList.includes(propName),
      enum: Array.isArray(propDef?.enum) ? (propDef.enum as string[]) : undefined,
    }));
  }

  const name = typeof raw['name'] === 'string' ? raw['name'] : 'Unknown Tool';
  const id = typeof raw['id'] === 'string' ? raw['id'] : name;

  return {
    id,
    name,
    description: typeof raw['description'] === 'string' ? raw['description'] : '',
    category,
    parameters,
    requiresAuth: raw['requires_auth'] === true || raw['requiresAuth'] === true,
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
    try {
      const res = await apiClient.get<Record<string, unknown> | unknown[]>(
        this.config.backend.toolsPath,
        { timeout: 10_000 }
      );

      let rawArray: unknown[] = [];
      if (Array.isArray(res)) {
        rawArray = res;
      } else if (res && typeof res === 'object') {
        const payload = res as Record<string, unknown>;
        if (Array.isArray(payload['data'])) {
          rawArray = payload['data'];
        } else if (Array.isArray(payload['tools'])) {
          rawArray = payload['tools'];
        }
      }

      this.tools = rawArray
        .filter((t): t is Record<string, unknown> => typeof t === 'object' && t !== null)
        .map(normalizeToolDefinition);

      return { success: true, data: this.tools };
    } catch {
      return {
        success: false,
        error: {
          code: 'TOOL_FAILED',
          message: 'Cannot load tool registry from backend.',
          timestamp: Date.now(),
        },
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

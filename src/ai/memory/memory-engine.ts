// ============================================================================
// AETHER AI — Memory Engine (Frontend Coordination)
// ============================================================================
// Coordinates memory operations: create, read, update, delete, search.
// All memory is user-scoped and stored on the AETHER backend.
// ============================================================================

import type { MemoryEntry, MemoryScope, MemoryEntryType, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

export interface CreateMemoryRequest {
  content: string;
  scope: MemoryScope;
  type: MemoryEntryType;
  conversationId?: string;
  tags?: string[];
  expiresAt?: number;
}

export interface MemorySearchQuery {
  text: string;
  scope?: MemoryScope;
  limit?: number;
}

/**
 * Normalize raw backend memory entry.
 */
export function normalizeMemoryEntry(raw: Record<string, unknown>): MemoryEntry {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `mem_${Date.now()}`,
    scope: (raw['scope'] as MemoryScope) ?? 'conversation',
    type: (raw['type'] as MemoryEntryType) ?? 'context',
    content: typeof raw['content'] === 'string' ? raw['content'] : '',
    userId: typeof raw['user_id'] === 'string' ? raw['user_id'] : '',
    conversationId: typeof raw['conversation_id'] === 'string' ? raw['conversation_id'] : undefined,
    score: typeof raw['score'] === 'number' ? raw['score'] : undefined,
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    expiresAt: typeof raw['expires_at'] === 'number' ? raw['expires_at'] : undefined,
    tags: Array.isArray(raw['tags']) ? (raw['tags'] as string[]) : undefined,
  };
}

const BASE_URL = () =>
  `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.memoryPath}`;

/**
 * MemoryEngine — frontend memory management coordinating with the backend.
 */
export class MemoryEngine {
  async list(scope?: MemoryScope): Promise<AIResult<MemoryEntry[]>> {
    const url = scope ? `${BASE_URL()}?scope=${scope}` : BASE_URL();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'MEMORY_FAILED', message: 'Failed to load memories.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as { entries?: unknown[] } | unknown[];
      const entries = Array.isArray(raw) ? raw : ((raw as { entries?: unknown[] }).entries ?? []);
      return {
        success: true,
        data: entries
          .filter((e): e is Record<string, unknown> => typeof e === 'object' && e !== null)
          .map(normalizeMemoryEntry),
      };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot reach memory backend.', timestamp: Date.now() },
      };
    }
  }

  async create(request: CreateMemoryRequest): Promise<AIResult<MemoryEntry>> {
    try {
      const res = await fetch(BASE_URL(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: request.content,
          scope: request.scope,
          type: request.type,
          conversation_id: request.conversationId,
          tags: request.tags,
          expires_at: request.expiresAt,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'MEMORY_FAILED', message: 'Failed to create memory entry.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeMemoryEntry(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot create memory entry.', timestamp: Date.now() },
      };
    }
  }

  async update(id: string, content: string): Promise<AIResult<MemoryEntry>> {
    try {
      const res = await fetch(`${BASE_URL()}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'MEMORY_FAILED', message: 'Failed to update memory entry.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeMemoryEntry(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot update memory entry.', timestamp: Date.now() },
      };
    }
  }

  async delete(id: string): Promise<AIResult<void>> {
    try {
      const res = await fetch(`${BASE_URL()}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'MEMORY_FAILED', message: 'Failed to delete memory entry.', timestamp: Date.now() },
        };
      }
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot delete memory entry.', timestamp: Date.now() },
      };
    }
  }

  async search(query: MemorySearchQuery): Promise<AIResult<MemoryEntry[]>> {
    try {
      const res = await fetch(`${BASE_URL()}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.text,
          scope: query.scope,
          limit: query.limit ?? DEFAULT_AI_CONFIG.memory.longTermSearchLimit,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'MEMORY_FAILED', message: 'Memory search failed.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((e): e is Record<string, unknown> => typeof e === 'object' && e !== null)
          .map(normalizeMemoryEntry),
      };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot search memory.', timestamp: Date.now() },
      };
    }
  }
}

export const memoryEngine = new MemoryEngine();

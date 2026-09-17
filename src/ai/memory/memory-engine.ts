// ============================================================================
// AETHER AI — Memory Engine (Frontend Coordination)
// ============================================================================
// Coordinates memory operations: create, read, update, delete, search.
// All memory is user-scoped and stored on the AETHER backend.
// ============================================================================

import type { MemoryEntry, MemoryScope, MemoryEntryType, AIResult } from '../ai-types';
import { apiClient } from '../../api/client';

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
    type: (raw['type'] as MemoryEntryType) ?? 'fact',
    content: typeof raw['content'] === 'string' ? raw['content'] : '',
    userId:
      typeof raw['userId'] === 'string'
        ? raw['userId']
        : typeof raw['user_id'] === 'string'
          ? raw['user_id']
          : '',
    conversationId:
      typeof raw['conversationId'] === 'string'
        ? raw['conversationId']
        : typeof raw['conversation_id'] === 'string'
          ? raw['conversation_id']
          : undefined,
    score:
      typeof raw['importance'] === 'number'
        ? raw['importance']
        : typeof raw['score'] === 'number'
          ? raw['score']
          : undefined,
    createdAt:
      typeof raw['createdAt'] === 'number'
        ? raw['createdAt']
        : typeof raw['created_at'] === 'number'
          ? raw['created_at']
          : Date.now(),
    updatedAt:
      typeof raw['updatedAt'] === 'number'
        ? raw['updatedAt']
        : typeof raw['updated_at'] === 'number'
          ? raw['updated_at']
          : Date.now(),
    expiresAt:
      typeof raw['expiresAt'] === 'number'
        ? raw['expiresAt']
        : typeof raw['expires_at'] === 'number'
          ? raw['expires_at']
          : undefined,
    tags: Array.isArray(raw['tags']) ? (raw['tags'] as string[]) : undefined,
  };
}

/**
 * MemoryEngine — frontend memory management coordinating with the backend.
 */
export class MemoryEngine {
  async list(scope?: MemoryScope): Promise<AIResult<MemoryEntry[]>> {
    const path = scope ? `/ai/memory?scope=${encodeURIComponent(scope)}` : '/ai/memory';
    try {
      const res = await apiClient.get<any>(path);
      const payload = res?.data ?? res;
      const entries = Array.isArray(payload) ? payload : (payload?.entries ?? []);
      return {
        success: true,
        data: entries
          .filter((e: any): e is Record<string, unknown> => typeof e === 'object' && e !== null)
          .map(normalizeMemoryEntry),
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'MEMORY_FAILED',
          message: 'Cannot reach memory backend.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async create(request: CreateMemoryRequest): Promise<AIResult<MemoryEntry>> {
    try {
      const res = await apiClient.post<any>('/ai/memory', {
        content: request.content,
        scope: request.scope,
        type: request.type,
        conversation_id: request.conversationId,
        tags: request.tags,
        expires_at: request.expiresAt,
      });
      const raw = res?.data ?? res;
      return { success: true, data: normalizeMemoryEntry(raw) };
    } catch {
      return {
        success: false,
        error: {
          code: 'MEMORY_FAILED',
          message: 'Cannot create memory entry.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async update(id: string, content: string): Promise<AIResult<MemoryEntry>> {
    try {
      const res = await apiClient.patch<any>(`/ai/memory/${encodeURIComponent(id)}`, {
        content,
      });
      const raw = res?.data ?? res;
      return { success: true, data: normalizeMemoryEntry(raw) };
    } catch {
      return {
        success: false,
        error: {
          code: 'MEMORY_FAILED',
          message: 'Cannot update memory entry.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async delete(id: string): Promise<AIResult<void>> {
    try {
      await apiClient.delete(`/ai/memory/${encodeURIComponent(id)}`);
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'MEMORY_FAILED',
          message: 'Cannot delete memory entry.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async search(query: MemorySearchQuery): Promise<AIResult<MemoryEntry[]>> {
    try {
      const res = await apiClient.post<any>('/ai/memory/search', {
        text: query.text,
        scope: query.scope,
        topK: query.limit ?? 10,
      });
      const payload = res?.data ?? res;
      const raw = Array.isArray(payload) ? payload : (payload?.results ?? []);
      return {
        success: true,
        data: raw
          .filter((e: any): e is Record<string, unknown> => typeof e === 'object' && e !== null)
          .map(normalizeMemoryEntry),
      };
    } catch {
      return {
        success: false,
        error: { code: 'MEMORY_FAILED', message: 'Cannot search memory.', timestamp: Date.now() },
      };
    }
  }

  async getMemories(_userId?: string): Promise<AIResult<MemoryEntry[]>> {
    return this.list();
  }

  async searchMemories(query: string, _userId?: string): Promise<AIResult<MemoryEntry[]>> {
    return this.search({ text: query });
  }
}

export const memoryEngine = new MemoryEngine();

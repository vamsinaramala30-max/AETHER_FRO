// ============================================================================
// AETHER AI — Conversation Store (Backend CRUD)
// ============================================================================

import type { AIConversation, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

function normalizeConversation(raw: Record<string, unknown>): AIConversation {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `conv_${Date.now()}`,
    title: typeof raw['title'] === 'string' ? raw['title'] : 'Untitled',
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    messages: [],
    metadata: typeof raw['metadata'] === 'object' && raw['metadata'] !== null
      ? (raw['metadata'] as AIConversation['metadata'])
      : {},
    draft: typeof raw['draft'] === 'string' ? raw['draft'] : undefined,
  };
}

const BASE = () =>
  `${DEFAULT_AI_CONFIG.backend.baseUrl}/api/ai/conversations`;

/**
 * ConversationStore manages CRUD for conversations via the backend.
 */
export class ConversationStore {
  async list(): Promise<AIResult<AIConversation[]>> {
    try {
      const res = await fetch(BASE(), { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to load conversations.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((c): c is Record<string, unknown> => typeof c === 'object' && c !== null)
          .map(normalizeConversation),
      };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load conversations.', timestamp: Date.now() },
      };
    }
  }

  async get(id: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Conversation not found.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot fetch conversation.', timestamp: Date.now() },
      };
    }
  }

  async create(title: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await fetch(BASE(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to create conversation.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot create conversation.', timestamp: Date.now() },
      };
    }
  }

  async rename(id: string, title: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to rename conversation.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot rename conversation.', timestamp: Date.now() },
      };
    }
  }

  async delete(id: string): Promise<AIResult<void>> {
    try {
      const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to delete conversation.', timestamp: Date.now() },
        };
      }
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot delete conversation.', timestamp: Date.now() },
      };
    }
  }
}

export { normalizeConversation };
export const conversationStore = new ConversationStore();

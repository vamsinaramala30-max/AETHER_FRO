// ============================================================================
// AETHER AI — Conversation Store (Backend CRUD)
// ============================================================================

import type { AIConversation, AIResult } from '../ai-types';
import { apiClient } from '../../api/client';

function normalizeConversation(raw: Record<string, unknown>): AIConversation {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `conv_${Date.now()}`,
    title: typeof raw['title'] === 'string' ? raw['title'] : 'Untitled',
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
    messages: [],
    metadata:
      typeof raw['metadata'] === 'object' && raw['metadata'] !== null
        ? (raw['metadata'] as AIConversation['metadata'])
        : {},
    draft: typeof raw['draft'] === 'string' ? raw['draft'] : undefined,
  };
}

/**
 * ConversationStore manages CRUD for conversations via the backend.
 */
export class ConversationStore {
  async list(): Promise<AIResult<AIConversation[]>> {
    try {
      const res = await apiClient.get<any>('/ai/conversations');
      const payload = res?.data || res;
      const rawList = Array.isArray(payload) ? payload : [];
      return {
        success: true,
        data: rawList
          .filter((c): c is Record<string, unknown> => typeof c === 'object' && c !== null)
          .map(normalizeConversation),
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot load conversations.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async get(id: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await apiClient.get<any>(`/ai/conversations/${encodeURIComponent(id)}`);
      const raw = res?.data || res;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot fetch conversation.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async create(title: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await apiClient.post<any>('/ai/conversations', { title });
      const raw = res?.data || res;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot create conversation.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async rename(id: string, title: string): Promise<AIResult<AIConversation>> {
    try {
      const res = await apiClient.patch<any>(`/ai/conversations/${encodeURIComponent(id)}`, {
        title,
      });
      const raw = res?.data || res;
      return { success: true, data: normalizeConversation(raw) };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot rename conversation.',
          timestamp: Date.now(),
        },
      };
    }
  }

  async delete(id: string): Promise<AIResult<void>> {
    try {
      await apiClient.delete(`/ai/conversations/${encodeURIComponent(id)}`);
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Cannot delete conversation.',
          timestamp: Date.now(),
        },
      };
    }
  }
}

export { normalizeConversation };
export const conversationStore = new ConversationStore();

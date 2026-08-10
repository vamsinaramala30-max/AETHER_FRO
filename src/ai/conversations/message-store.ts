// ============================================================================
// AETHER AI — Message Store (Backend CRUD)
// ============================================================================

import type { AIMessage, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';

function normalizeMessage(raw: Record<string, unknown>): AIMessage {
  return {
    id: typeof raw['id'] === 'string' ? raw['id'] : `msg_${Date.now()}`,
    conversationId: typeof raw['conversation_id'] === 'string' ? raw['conversation_id'] : '',
    role: (raw['role'] as AIMessage['role']) ?? 'user',
    content: typeof raw['content'] === 'string' ? raw['content'] : '',
    status: (raw['status'] as AIMessage['status']) ?? 'delivered',
    createdAt: typeof raw['created_at'] === 'number' ? raw['created_at'] : Date.now(),
    updatedAt: typeof raw['updated_at'] === 'number' ? raw['updated_at'] : Date.now(),
    error: typeof raw['error'] === 'string' ? raw['error'] : undefined,
    citations: Array.isArray(raw['citations'])
      ? raw['citations'].flatMap((c) => {
          if (typeof c !== 'object' || c === null) return [];
          const cr = c as Record<string, unknown>;
          return [{
            id: typeof cr['id'] === 'string' ? cr['id'] : '',
            title: typeof cr['title'] === 'string' ? cr['title'] : '',
            url: typeof cr['url'] === 'string' ? cr['url'] : undefined,
            snippet: typeof cr['snippet'] === 'string' ? cr['snippet'] : undefined,
            score: typeof cr['score'] === 'number' ? cr['score'] : undefined,
          }];
        })
      : undefined,
    tokens:
      typeof raw['tokens'] === 'object' && raw['tokens'] !== null
        ? {
            prompt: typeof (raw['tokens'] as Record<string, unknown>)['prompt'] === 'number'
              ? (raw['tokens'] as Record<string, number>)['prompt']
              : undefined,
            completion: typeof (raw['tokens'] as Record<string, unknown>)['completion'] === 'number'
              ? (raw['tokens'] as Record<string, number>)['completion']
              : undefined,
            total: typeof (raw['tokens'] as Record<string, unknown>)['total'] === 'number'
              ? (raw['tokens'] as Record<string, number>)['total']
              : undefined,
          }
        : undefined,
  };
}

const BASE = (conversationId: string) =>
  `${DEFAULT_AI_CONFIG.backend.baseUrl}/api/ai/conversations/${encodeURIComponent(conversationId)}/messages`;

/**
 * MessageStore manages message CRUD for a conversation.
 */
export class MessageStore {
  async list(conversationId: string): Promise<AIResult<AIMessage[]>> {
    try {
      const res = await fetch(BASE(conversationId), { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to load messages.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as unknown[];
      return {
        success: true,
        data: raw
          .filter((m): m is Record<string, unknown> => typeof m === 'object' && m !== null)
          .map(normalizeMessage),
      };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot load messages.', timestamp: Date.now() },
      };
    }
  }

  async send(
    conversationId: string,
    content: string,
    role: AIMessage['role'] = 'user',
  ): Promise<AIResult<AIMessage>> {
    try {
      const res = await fetch(BASE(conversationId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, role }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'GENERATION_FAILED', message: 'Failed to send message.', timestamp: Date.now() },
        };
      }
      const raw = await res.json() as Record<string, unknown>;
      return { success: true, data: normalizeMessage(raw) };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot send message.', timestamp: Date.now() },
      };
    }
  }

  async delete(conversationId: string, messageId: string): Promise<AIResult<void>> {
    try {
      const res = await fetch(`${BASE(conversationId)}/${encodeURIComponent(messageId)}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Failed to delete message.', timestamp: Date.now() },
        };
      }
      return { success: true, data: undefined };
    } catch {
      return {
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Cannot delete message.', timestamp: Date.now() },
      };
    }
  }
}

export { normalizeMessage };
export const messageStore = new MessageStore();

// ============================================================================
// AETHER AI — Conversation Memory
// ============================================================================
// Frontend state management for conversation-scoped memory entries.
// ============================================================================

import type { MemoryEntry } from '../ai-types';
import { memoryEngine } from './memory-engine';

/**
 * Load all conversation-scoped memory entries.
 */
export async function loadConversationMemory(
  conversationId: string,
): Promise<MemoryEntry[]> {
  const result = await memoryEngine.list('conversation');
  if (!result.success) return [];
  return result.data.filter((e) => e.conversationId === conversationId);
}

/**
 * Save a conversation-scoped memory entry.
 */
export async function saveConversationMemory(
  conversationId: string,
  content: string,
): Promise<MemoryEntry | null> {
  const result = await memoryEngine.create({
    content,
    scope: 'conversation',
    type: 'context',
    conversationId,
  });
  return result.success ? result.data : null;
}

/**
 * Clear all memory for a conversation.
 */
export async function clearConversationMemory(
  entries: MemoryEntry[],
  conversationId: string,
): Promise<void> {
  const conversationEntries = entries.filter(
    (e) => e.scope === 'conversation' && e.conversationId === conversationId,
  );
  await Promise.allSettled(conversationEntries.map((e) => memoryEngine.delete(e.id)));
}

export const conversationMemory = {
  loadConversationMemory,
  saveConversationMemory,
  clearConversationMemory,
};

// ============================================================================
// AETHER AI — Memory Retriever
// ============================================================================
// Retrieves relevant memory entries for injection into generation context.
// ============================================================================

import type { MemoryEntry, MemoryScope } from '../ai-types';
import { memoryEngine } from './memory-engine';
import { DEFAULT_AI_CONFIG } from '../ai-config';

/**
 * Retrieve memory entries relevant to a given query for context injection.
 */
export async function retrieveRelevantMemory(
  query: string,
  scope?: MemoryScope,
): Promise<MemoryEntry[]> {
  const result = await memoryEngine.search({
    text: query,
    scope,
    limit: DEFAULT_AI_CONFIG.memory.longTermSearchLimit,
  });
  if (!result.success) return [];
  return result.data;
}

/**
 * Get the most recent conversation memory entries.
 */
export async function getRecentConversationMemory(
  conversationId: string,
  limit = 10,
): Promise<MemoryEntry[]> {
  const result = await memoryEngine.list('conversation');
  if (!result.success) return [];
  return result.data
    .filter((e) => e.conversationId === conversationId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

/**
 * Format memory entries into a context string for the system prompt.
 */
export function formatMemoryForContext(entries: MemoryEntry[]): string {
  if (entries.length === 0) return '';
  return entries.map((e) => `• ${e.content}`).join('\n');
}

export const memoryRetriever = {
  retrieveRelevantMemory,
  getRecentConversationMemory,
  formatMemoryForContext,
};

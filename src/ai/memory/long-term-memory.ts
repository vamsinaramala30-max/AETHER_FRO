// ============================================================================
// AETHER AI — Long-Term Memory
// ============================================================================
// Frontend abstraction for user's persisted long-term memory on the backend.
// ============================================================================

import type { MemoryEntry, AIResult } from '../ai-types';
import { memoryEngine } from './memory-engine';

/**
 * Load all long-term memory entries for the current user.
 */
export async function loadLongTermMemory(): Promise<MemoryEntry[]> {
  const result = await memoryEngine.list('long_term');
  if (!result.success) return [];
  return result.data;
}

/**
 * Save a long-term memory fact.
 */
export async function saveLongTermFact(
  content: string,
  tags?: string[],
): Promise<AIResult<MemoryEntry>> {
  return memoryEngine.create({
    content,
    scope: 'long_term',
    type: 'fact',
    tags,
  });
}

/**
 * Save a long-term user preference.
 */
export async function saveLongTermPreference(
  content: string,
  tags?: string[],
): Promise<AIResult<MemoryEntry>> {
  return memoryEngine.create({
    content,
    scope: 'long_term',
    type: 'preference',
    tags,
  });
}

/**
 * Delete a long-term memory entry.
 */
export async function deleteLongTermMemory(id: string): Promise<AIResult<void>> {
  return memoryEngine.delete(id);
}

/**
 * Search long-term memory.
 */
export async function searchLongTermMemory(query: string): Promise<MemoryEntry[]> {
  const result = await memoryEngine.search({ text: query, scope: 'long_term' });
  if (!result.success) return [];
  return result.data;
}

export const longTermMemory = {
  loadLongTermMemory,
  saveLongTermFact,
  saveLongTermPreference,
  deleteLongTermMemory,
  searchLongTermMemory,
};

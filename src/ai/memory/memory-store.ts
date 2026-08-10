// ============================================================================
// AETHER AI — Memory Store (Frontend State)
// ============================================================================
// Frontend in-memory cache for memory entries fetched from the backend.
// Uses the central AI store for state management.
// ============================================================================

import type { MemoryEntry, MemoryScope, MemoryStatus } from '../ai-types';

/**
 * Build a MemoryStatus summary from a list of MemoryEntries.
 */
export function buildMemoryStatus(entries: MemoryEntry[]): MemoryStatus {
  const working = entries.filter((e) => e.scope === 'working').length;
  const conversation = entries.filter((e) => e.scope === 'conversation').length;
  const longTerm = entries.filter((e) => e.scope === 'long_term').length;
  const lastEntry = entries.sort((a, b) => b.updatedAt - a.updatedAt)[0];

  return {
    workingEntries: working,
    conversationEntries: conversation,
    longTermEntries: longTerm,
    totalEntries: entries.length,
    lastUpdatedAt: lastEntry?.updatedAt,
  };
}

/**
 * Filter memory entries by scope.
 */
export function filterByScope(entries: MemoryEntry[], scope: MemoryScope): MemoryEntry[] {
  return entries.filter((e) => e.scope === scope);
}

/**
 * Sort memory entries by recency.
 */
export function sortByRecency(entries: MemoryEntry[]): MemoryEntry[] {
  return [...entries].sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Group memory entries by scope for panel display.
 */
export function groupByScope(entries: MemoryEntry[]): Record<MemoryScope, MemoryEntry[]> {
  return {
    working: entries.filter((e) => e.scope === 'working'),
    conversation: entries.filter((e) => e.scope === 'conversation'),
    long_term: entries.filter((e) => e.scope === 'long_term'),
  };
}

export const memoryStore = {
  buildMemoryStatus,
  filterByScope,
  sortByRecency,
  groupByScope,
};

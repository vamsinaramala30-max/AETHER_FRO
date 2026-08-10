// ============================================================================
// AETHER AI — Working Memory
// ============================================================================
// Short-lived in-session memory for the current interaction context.
// Working memory is volatile and not persisted beyond the session.
// ============================================================================

import type { MemoryEntry } from '../ai-types';

/**
 * WorkingMemory holds transient, session-level context entries.
 * It is cleared when the user starts a new conversation.
 */
export class WorkingMemory {
  private entries: Map<string, MemoryEntry> = new Map();
  private readonly maxEntries: number;

  constructor(maxEntries = 20) {
    this.maxEntries = maxEntries;
  }

  /**
   * Add or update a working memory entry.
   */
  set(entry: MemoryEntry): void {
    this.entries.set(entry.id, entry);
    // Evict oldest entry if limit exceeded
    if (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest !== undefined) {
        this.entries.delete(oldest);
      }
    }
  }

  /**
   * Get all working memory entries.
   */
  getAll(): MemoryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get a specific working memory entry by ID.
   */
  get(id: string): MemoryEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Remove an entry by ID.
   */
  remove(id: string): void {
    this.entries.delete(id);
  }

  /**
   * Clear all working memory.
   */
  clear(): void {
    this.entries.clear();
  }

  /**
   * Get count of working memory entries.
   */
  get size(): number {
    return this.entries.size;
  }

  /**
   * Convert to a context string for injection.
   */
  toContextString(): string {
    const allEntries = this.getAll();
    if (allEntries.length === 0) return '';
    return allEntries.map((e) => e.content).join('\n');
  }
}

export const workingMemory = new WorkingMemory();

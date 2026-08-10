// ============================================================================
// AETHER AI — Memory Service
// ============================================================================

import type { MemoryEntry, MemoryScope, MemoryStatus, AIResult } from '../ai-types';
import { memoryEngine } from '../memory/memory-engine';
import { memoryStore } from '../memory/memory-store';

/**
 * MemoryService isolates all memory backend operations.
 * UI components use this via the useMemory hook.
 */
export class MemoryService {
  async loadAll(): Promise<AIResult<MemoryEntry[]>> {
    return memoryEngine.list();
  }

  async loadByScope(scope: MemoryScope): Promise<AIResult<MemoryEntry[]>> {
    return memoryEngine.list(scope);
  }

  async createEntry(
    content: string,
    scope: MemoryScope,
    type: MemoryEntry['type'],
    conversationId?: string,
    tags?: string[],
  ): Promise<AIResult<MemoryEntry>> {
    return memoryEngine.create({ content, scope, type, conversationId, tags });
  }

  async updateEntry(id: string, content: string): Promise<AIResult<MemoryEntry>> {
    return memoryEngine.update(id, content);
  }

  async deleteEntry(id: string): Promise<AIResult<void>> {
    return memoryEngine.delete(id);
  }

  async search(query: string, scope?: MemoryScope): Promise<AIResult<MemoryEntry[]>> {
    return memoryEngine.search({ text: query, scope });
  }

  buildStatus(entries: MemoryEntry[]): MemoryStatus {
    return memoryStore.buildMemoryStatus(entries);
  }

  groupByScope(entries: MemoryEntry[]): Record<MemoryScope, MemoryEntry[]> {
    return memoryStore.groupByScope(entries);
  }
}

export const memoryService = new MemoryService();

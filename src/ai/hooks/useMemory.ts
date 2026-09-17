// ============================================================================
// AETHER AI — useMemory Hook
// ============================================================================

import { useCallback, useEffect } from 'react';
import { useAIStore } from '../ai-store';
import { memoryService } from '../services/memory-service';
import type { MemoryEntry, MemoryScope, MemoryStatus } from '../ai-types';

export interface UseMemoryReturn {
  entries: MemoryEntry[];
  status: MemoryStatus | null;
  isLoading: boolean;

  createEntry: (
    content: string,
    scope: MemoryScope,
    type: MemoryEntry['type'],
    conversationId?: string,
    tags?: string[],
  ) => Promise<void>;
  updateEntry: (id: string, content: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  searchMemory: (query: string, scope?: MemoryScope) => Promise<MemoryEntry[]>;
  refresh: () => Promise<void>;
}

/**
 * useMemory — memory state and operations hook.
 */
export function useMemory(): UseMemoryReturn {
  const memoryEntries = useAIStore((s) => s.memoryEntries);
  const memoryStatus = useAIStore((s) => s.memoryStatus);
  const streamingStatus = useAIStore((s) => s.streamingStatus);

  const setMemoryEntries = useAIStore((s) => s.setMemoryEntries);
  const appendMemoryEntry = useAIStore((s) => s.appendMemoryEntry);
  const removeMemoryEntry = useAIStore((s) => s.removeMemoryEntry);
  const setMemoryStatus = useAIStore((s) => s.setMemoryStatus);
  const setError = useAIStore((s) => s.setError);

  const isLoading = streamingStatus === 'starting';

  const refresh = useCallback(async () => {
    const result = await memoryService.loadAll();
    if (!result.success) {
      setError(result.error);
      return;
    }
    setMemoryEntries(result.data);
    setMemoryStatus(memoryService.buildStatus(result.data));
  }, [setMemoryEntries, setMemoryStatus, setError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createEntry = useCallback(
    async (
      content: string,
      scope: MemoryScope,
      type: MemoryEntry['type'],
      conversationId?: string,
      tags?: string[],
    ) => {
      const result = await memoryService.createEntry(content, scope, type, conversationId, tags);
      if (!result.success) {
        setError(result.error);
        return;
      }
      appendMemoryEntry(result.data);
      setMemoryStatus(memoryService.buildStatus([...memoryEntries, result.data]));
    },
    [memoryEntries, appendMemoryEntry, setMemoryStatus, setError],
  );

  const updateEntry = useCallback(
    async (id: string, content: string) => {
      const result = await memoryService.updateEntry(id, content);
      if (!result.success) {
        setError(result.error);
        return;
      }
      // Refresh after update
      await refresh();
    },
    [setError, refresh],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const result = await memoryService.deleteEntry(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      removeMemoryEntry(id);
      setMemoryStatus(memoryService.buildStatus(memoryEntries.filter((e) => e.id !== id)));
    },
    [memoryEntries, removeMemoryEntry, setMemoryStatus, setError],
  );

  const searchMemory = useCallback(
    async (query: string, scope?: MemoryScope): Promise<MemoryEntry[]> => {
      const result = await memoryService.search(query, scope);
      if (!result.success) return [];
      return result.data;
    },
    [],
  );

  return {
    entries: memoryEntries,
    status: memoryStatus,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    searchMemory,
    refresh,
  };
}

import { create } from "zustand";
import {
  createMemory,
  deleteMemory,
  listMemories,
  updateMemory,
  type CreateMemoryInput,
} from "@/lib/aether/memory";
import type { MemoryRecord } from "@/lib/aether/types";

interface MemoryState {
  hydrated: boolean;
  records: MemoryRecord[];
  hydrate: () => Promise<void>;
  add: (input: CreateMemoryInput) => Promise<void>;
  edit: (record: MemoryRecord) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  hydrated: false,
  records: [],

  async hydrate() {
    set({ records: await listMemories(), hydrated: true });
  },

  async refresh() {
    set({ records: await listMemories() });
  },

  async add(input) {
    await createMemory(input);
    await get().refresh();
  },

  async edit(record) {
    await updateMemory(record);
    await get().refresh();
  },

  async remove(id) {
    await deleteMemory(id);
    await get().refresh();
  },
}));

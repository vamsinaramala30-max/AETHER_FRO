import { create } from "zustand";
import { ingestFile } from "@/lib/aether/ingest";
import { documentRepository } from "@/lib/aether/repositories";
import type { KnowledgeDocument } from "@/lib/aether/types";

interface KnowledgeState {
  hydrated: boolean;
  documents: KnowledgeDocument[];
  ingesting: string[];
  hydrate: () => Promise<void>;
  ingest: (files: File[], options?: { tags?: string[]; projectId?: string | null }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  upsert: (document: KnowledgeDocument) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  hydrated: false,
  documents: [],
  ingesting: [],

  async hydrate() {
    const documents = await documentRepository.list();
    set({ documents, hydrated: true });
  },

  upsert(document) {
    set((state) => ({
      documents: [document, ...state.documents.filter((d) => d.id !== document.id)].sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
    }));
  },

  async ingest(files, options) {
    for (const file of files) {
      set((state) => ({ ingesting: [...state.ingesting, file.name] }));
      try {
        await ingestFile(
          file,
          { tags: options?.tags ?? [], projectId: options?.projectId ?? null },
          { onUpdate: (document) => get().upsert(document) },
        );
      } finally {
        set((state) => ({ ingesting: state.ingesting.filter((name) => name !== file.name) }));
      }
    }
  },

  async remove(id) {
    await documentRepository.remove(id);
    set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }));
  },
}));

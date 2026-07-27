import { create } from 'zustand';

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface KnowledgeState {
  documents: DocumentItem[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  setDocuments: (documents: DocumentItem[]) => void;
  addDocument: (doc: DocumentItem) => void;
  removeDocument: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useKnowledgeStore = create<KnowledgeState>()((set) => ({
  documents: [],
  searchQuery: '',
  isLoading: false,
  error: null,

  setDocuments: (documents) => {
    set({ documents, isLoading: false });
  },
  addDocument: (doc) => {
    set((state) => ({ documents: [doc, ...state.documents] }));
  },
  removeDocument: (id) => {
    set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }));
  },
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
  },
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  setError: (error) => {
    set({ error, isLoading: false });
  },
}));

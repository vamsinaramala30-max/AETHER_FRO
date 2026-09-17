// frontend/src/knowledge/notes/notesService.ts
import { apiClient } from '@/api/client';
import { triggerActivityUpdate } from '@/shared/activityEvents';
import { Notebook, Section, Page, NotesAiAction, NotesAiResult, SearchResult } from './notes.types';

const CACHE_KEY = 'aether_notes_workspace_v2';

interface CachedWorkspace {
  notebooks: Notebook[];
  sections: Section[];
  pages: Page[];
}

function readCache(): CachedWorkspace {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return { notebooks: [], sections: [], pages: [] };
    const parsed = JSON.parse(stored);
    return {
      notebooks: Array.isArray(parsed.notebooks) ? parsed.notebooks : [],
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch {
    return { notebooks: [], sections: [], pages: [] };
  }
}

function writeCache(partial: Partial<CachedWorkspace>): void {
  try {
    const current = readCache();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...current, ...partial }));
  } catch {
    /* storage full or unavailable — offline cache is best-effort only */
  }
}

function unwrap<T>(res: any): T {
  return (res?.data ?? res) as T;
}

function normalizePage(raw: any): Page {
  return {
    id: raw.id,
    title: raw.title || 'Untitled Page',
    content: raw.content || '',
    formattedContent: raw.formattedContent || undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    category: raw.category || 'General',
    isPinned: Boolean(raw.isPinned),
    isFavorite: Boolean(raw.isFavorite),
    isArchived: Boolean(raw.isArchived),
    isQuickNote: Boolean(raw.isQuickNote),
    notebookId: raw.notebookId ?? null,
    sectionId: raw.sectionId ?? null,
    order: raw.order ?? 0,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    userId: raw.ownerId || raw.userId || 'user',
  };
}

export const notesService = {
  // ---------- Notebooks ----------
  async getNotebooks(): Promise<Notebook[]> {
    try {
      const res = await apiClient.get<any>('/knowledge/notebooks');
      const notebooks = unwrap<Notebook[]>(res) || [];
      writeCache({ notebooks });
      return notebooks;
    } catch {
      return readCache().notebooks;
    }
  },

  async createNotebook(name: string): Promise<Notebook> {
    const res = await apiClient.post<any>('/knowledge/notebooks', { name });
    const notebook = unwrap<Notebook>(res);
    triggerActivityUpdate();
    return notebook;
  },

  async renameNotebook(id: string, name: string): Promise<Notebook> {
    const res = await apiClient.patch<any>(`/knowledge/notebooks/${id}`, { name });
    return unwrap<Notebook>(res);
  },

  async deleteNotebook(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/notebooks/${id}`);
    triggerActivityUpdate();
  },

  // ---------- Sections ----------
  async getSections(notebookId: string): Promise<Section[]> {
    try {
      const res = await apiClient.get<any>(`/knowledge/notebooks/${notebookId}/sections`);
      const sections = unwrap<Section[]>(res) || [];
      const cache = readCache();
      const merged = [...cache.sections.filter((s) => s.notebookId !== notebookId), ...sections];
      writeCache({ sections: merged });
      return sections;
    } catch {
      return readCache().sections.filter((s) => s.notebookId === notebookId);
    }
  },

  async createSection(notebookId: string, name: string): Promise<Section> {
    const res = await apiClient.post<any>(`/knowledge/notebooks/${notebookId}/sections`, { name });
    const section = unwrap<Section>(res);
    triggerActivityUpdate();
    return section;
  },

  async renameSection(id: string, name: string): Promise<Section> {
    const res = await apiClient.patch<any>(`/knowledge/sections/${id}`, { name });
    return unwrap<Section>(res);
  },

  async deleteSection(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/sections/${id}`);
    triggerActivityUpdate();
  },

  // ---------- Pages ----------
  async getPages(sectionId?: string): Promise<Page[]> {
    try {
      const params: Record<string, any> = { limit: 200 };
      if (sectionId) params.sectionId = sectionId;
      const res = await apiClient.get<any>('/knowledge/notes', { params });
      const payload = unwrap<any>(res);
      const raw = Array.isArray(payload) ? payload : payload?.data || [];
      const pages = raw.map(normalizePage);
      const cache = readCache();
      const merged = sectionId
        ? [...cache.pages.filter((p) => p.sectionId !== sectionId), ...pages]
        : pages;
      writeCache({ pages: merged });
      return pages;
    } catch {
      return sectionId
        ? readCache().pages.filter((p) => p.sectionId === sectionId)
        : readCache().pages;
    }
  },

  async getQuickNotes(): Promise<Page[]> {
    try {
      const res = await apiClient.get<any>('/knowledge/notes', { params: { isQuickNote: true, limit: 200 } });
      const payload = unwrap<any>(res);
      const raw = Array.isArray(payload) ? payload : payload?.data || [];
      return raw.map(normalizePage);
    } catch {
      return readCache().pages.filter((p) => p.isQuickNote);
    }
  },

  async getPage(id: string): Promise<Page> {
    const res = await apiClient.get<any>(`/knowledge/notes/${id}`);
    return normalizePage(unwrap<any>(res));
  },

  async createPage(sectionId: string, notebookId: string, title = 'Untitled Page'): Promise<Page> {
    const res = await apiClient.post<any>('/knowledge/notes', { title, content: '', sectionId, notebookId });
    const page = normalizePage(unwrap<any>(res));
    triggerActivityUpdate();
    return page;
  },

  async createQuickNote(content = ''): Promise<Page> {
    const res = await apiClient.post<any>('/knowledge/notes', {
      title: 'Quick Note',
      content,
      isQuickNote: true,
    });
    const page = normalizePage(unwrap<any>(res));
    triggerActivityUpdate();
    return page;
  },

  /** Debounced autosave target. Falls back to local cache on network failure so writing is never lost. */
  async savePage(
    id: string,
    updates: Partial<Pick<Page, 'title' | 'content' | 'formattedContent' | 'tags' | 'isPinned' | 'isFavorite'>>,
  ): Promise<{ page: Page; offline: boolean }> {
    try {
      const res = await apiClient.patch<any>(`/knowledge/notes/${id}`, updates);
      const page = normalizePage(unwrap<any>(res));
      const cache = readCache();
      writeCache({ pages: cache.pages.map((p) => (p.id === id ? page : p)) });
      triggerActivityUpdate();
      return { page, offline: false };
    } catch {
      const cache = readCache();
      const existing = cache.pages.find((p) => p.id === id);
      const merged: Page = {
        ...(existing as Page),
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      } as Page;
      writeCache({ pages: cache.pages.map((p) => (p.id === id ? merged : p)) });
      return { page: merged, offline: true };
    }
  },

  async movePage(id: string, notebookId: string, sectionId: string): Promise<Page> {
    const res = await apiClient.patch<any>(`/knowledge/notes/${id}/move`, { notebookId, sectionId });
    triggerActivityUpdate();
    return normalizePage(unwrap<any>(res));
  },

  async reorderPages(sectionId: string, orderedIds: string[]): Promise<void> {
    await apiClient.post('/knowledge/notes/reorder', { sectionId, orderedIds });
  },

  async deletePage(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/notes/${id}`);
    const cache = readCache();
    writeCache({ pages: cache.pages.filter((p) => p.id !== id) });
    triggerActivityUpdate();
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<Page> {
    const res = await apiClient.patch<any>(`/knowledge/notes/${id}`, { isFavorite });
    return normalizePage(unwrap<any>(res));
  },

  async getFavorites(): Promise<Page[]> {
    try {
      const res = await apiClient.get<any>('/knowledge/notes', { params: { isFavorite: true, limit: 200 } });
      const payload = unwrap<any>(res);
      const raw = Array.isArray(payload) ? payload : payload?.data || [];
      return raw.map(normalizePage);
    } catch {
      return readCache().pages.filter((p) => p.isFavorite);
    }
  },

  async getRecent(): Promise<Page[]> {
    try {
      const res = await apiClient.get<any>('/knowledge/notes', {
        params: { sortBy: 'updatedAt', sortOrder: 'desc', limit: 25 },
      });
      const payload = unwrap<any>(res);
      const raw = Array.isArray(payload) ? payload : payload?.data || [];
      return raw.map(normalizePage);
    } catch {
      return [...readCache().pages]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 25);
    }
  },

  // ---------- Search ----------
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    try {
      const res = await apiClient.get<any>('/knowledge/notes', {
        params: { search: query, limit: 50 },
      });
      const payload = unwrap<any>(res);
      const raw = Array.isArray(payload) ? payload : payload?.data || [];
      const notebooks = readCache().notebooks;
      const sections = readCache().sections;
      return raw.map((n: any) => {
        const page = normalizePage(n);
        const section = sections.find((s) => s.id === page.sectionId);
        const notebook = notebooks.find((nb) => nb.id === page.notebookId);
        const idx = page.content.toLowerCase().indexOf(query.toLowerCase());
        const snippet =
          idx >= 0
            ? `...${page.content.slice(Math.max(0, idx - 40), idx + 60)}...`
            : page.content.slice(0, 100);
        return {
          page,
          notebookName: notebook?.name || (page.isQuickNote ? 'Quick Notes' : ''),
          sectionName: section?.name || '',
          snippet,
        };
      });
    } catch {
      // Offline: search the cached pages the user has already loaded.
      const q = query.toLowerCase();
      const cache = readCache();
      return cache.pages
        .filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
        .map((page) => ({
          page,
          notebookName: cache.notebooks.find((nb) => nb.id === page.notebookId)?.name || '',
          sectionName: cache.sections.find((s) => s.id === page.sectionId)?.name || '',
          snippet: page.content.slice(0, 100),
        }));
    }
  },

  // ---------- AI ----------
  async runAiAction(pageId: string, action: NotesAiAction, question?: string): Promise<NotesAiResult> {
    const res = await apiClient.post<any>(`/knowledge/notes/${pageId}/ai`, { action, question });
    return unwrap<NotesAiResult>(res);
  },

  async applyAiSuggestion(pageId: string, content: string): Promise<Page> {
    const res = await apiClient.post<any>(`/knowledge/notes/${pageId}/ai/apply`, { content });
    return normalizePage(unwrap<any>(res));
  },
};

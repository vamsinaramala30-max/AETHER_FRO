// frontend/src/knowledge/notes/notesService.ts
import { Note } from '../types';
import { apiClient } from '@/api/client';
import { triggerActivityUpdate } from '@/shared/activityEvents';

export const notesService = {
  async getNotes(): Promise<Note[]> {
    try {
      const res = await apiClient.get<any>('/knowledge/notes');
      const payload = res.data || res;
      const rawNotes = Array.isArray(payload) ? payload : payload?.data || [];
      if (Array.isArray(rawNotes)) {
        const formatted: Note[] = rawNotes.map((n: any) => ({
          id: n.id,
          title: n.title || 'Untitled Note',
          content: n.content || '',
          tags: Array.isArray(n.tags) ? n.tags : [],
          isPinned: Boolean(n.isPinned),
          createdAt: n.createdAt || new Date().toISOString(),
          updatedAt: n.updatedAt || new Date().toISOString(),
          userId: n.ownerId || n.userId || 'user',
        }));
        localStorage.setItem('aether_notes', JSON.stringify(formatted));
        return formatted;
      }
    } catch {
      // Network fallback to cached local notes
      const stored = localStorage.getItem('aether_notes');
      if (typeof stored === 'string' && stored.trim() !== '') {
        try {
          const parsed = JSON.parse(stored) as Note[];
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          /* ignore parse error */
        }
      }
    }
    return [];
  },

  async saveNote(
    note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { createdAt?: string; id?: string },
  ): Promise<Note> {
    const isUpdate =
      typeof note.id === 'string' && note.id.trim() !== '' && !note.id.startsWith('note-temp');

    try {
      if (isUpdate) {
        const res = await apiClient.patch<any>(`/knowledge/notes/${note.id}`, {
          title: note.title,
          content: note.content,
          tags: note.tags,
          isPinned: note.isPinned,
        });
        const item = res.data || res;
        triggerActivityUpdate();
        return {
          id: item.id || note.id,
          title: item.title || note.title,
          content: item.content || note.content,
          tags: item.tags || note.tags || [],
          isPinned: Boolean(item.isPinned ?? note.isPinned),
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          userId: item.ownerId || 'user',
        };
      } else {
        const res = await apiClient.post<any>('/knowledge/notes', {
          title: note.title || 'Untitled Note',
          content: note.content || '',
          tags: note.tags || [],
          isPinned: note.isPinned || false,
        });
        const item = res.data || res;
        triggerActivityUpdate();
        return {
          id: item.id || crypto.randomUUID(),
          title: item.title || note.title,
          content: item.content || note.content,
          tags: item.tags || note.tags || [],
          isPinned: Boolean(item.isPinned ?? note.isPinned),
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          userId: item.ownerId || 'user',
        };
      }
    } catch {
      // Local fallback saving
      const notes = await this.getNotes();
      const now = new Date().toISOString();
      const id = isUpdate ? note.id! : crypto.randomUUID();
      const updatedNote: Note = {
        id,
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        isPinned: Boolean(note.isPinned),
        createdAt: note.createdAt || now,
        updatedAt: now,
        userId: 'current-user',
      };
      const idx = notes.findIndex((n) => n.id === id);
      if (idx > -1) notes[idx] = updatedNote;
      else notes.unshift(updatedNote);
      localStorage.setItem('aether_notes', JSON.stringify(notes));
      return updatedNote;
    }
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient.delete(`/knowledge/notes/${id}`);
    const stored = localStorage.getItem('aether_notes');
    if (typeof stored === 'string' && stored.trim() !== '') {
      try {
        const parsed = JSON.parse(stored) as Note[];
        const filtered = parsed.filter((n) => n.id !== id);
        localStorage.setItem('aether_notes', JSON.stringify(filtered));
      } catch {
        /* ignore parse error */
      }
    }
    triggerActivityUpdate();
  },
};

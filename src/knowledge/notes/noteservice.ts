// frontend/src/knowledge/notes/notesService.ts
import { Note } from '../types';

export const notesService = {
  async getNotes(): Promise<Note[]> {
    // Mimic API latency
    await new Promise((res) => setTimeout(res, 400));
    const stored = localStorage.getItem('aether_notes');
    if (typeof stored === 'string' && stored.trim() !== '') {
      try {
        const parsed = JSON.parse(stored) as Note[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  },

  async saveNote(
    note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { createdAt?: string },
  ): Promise<Note> {
    const notes = await this.getNotes();
    const now = new Date().toISOString();

    const hasNoteId = typeof note.id === 'string' && note.id.trim() !== '';
    const existingIndex = hasNoteId ? notes.findIndex((n) => n.id === note.id) : -1;
    let updatedNote: Note;

    if (existingIndex > -1) {
      updatedNote = {
        ...notes[existingIndex],
        ...note,
        id: notes[existingIndex].id,
        updatedAt: now,
      };
      notes[existingIndex] = updatedNote;
    } else {
      const id = hasNoteId ? note.id : crypto.randomUUID();
      const createdAt =
        typeof note.createdAt === 'string' && note.createdAt.trim() !== '' ? note.createdAt : now;
      updatedNote = {
        ...note,
        id,
        createdAt,
        updatedAt: now,
        userId: 'current-user',
      };
      notes.push(updatedNote);
    }

    localStorage.setItem('aether_notes', JSON.stringify(notes));
    return updatedNote;
  },

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter((n) => n.id !== id);
    localStorage.setItem('aether_notes', JSON.stringify(filtered));
  },
};

// frontend/src/knowledge/notes/notesService.ts
import { Note } from '../types';

export const notesService = {
  async getNotes(): Promise<Note[]> {
    // Mimic API latency
    await new Promise((res) => setTimeout(res, 400));
    return JSON.parse(localStorage.getItem('aether_notes') || '[]');
  },

  async saveNote(note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { createdAt?: string }): Promise<Note> {
    const notes = await this.getNotes();
    const now = new Date().toISOString();
    
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    let updatedNote: Note;

    if (existingIndex > -1) {
      updatedNote = {
        ...notes[existingIndex],
        ...note,
        updatedAt: now,
      };
      notes[existingIndex] = updatedNote;
    } else {
      updatedNote = {
        ...note,
        id: note.id || crypto.randomUUID(),
        createdAt: note.createdAt || now,
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
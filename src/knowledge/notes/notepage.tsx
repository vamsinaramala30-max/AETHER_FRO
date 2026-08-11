// frontend/src/knowledge/notes/NotesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { notesService } from './noteservice';
import { NoteCard } from './notecard';
import { NoteEditor } from './noteeditor';
import { NoteFilters } from './notefilters';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FileText, Plus } from 'lucide-react';
import { onActivityUpdate } from '@/shared/activityEvents';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notesService.getNotes();
      setNotes(data);
      setError(null);
    } catch {
      setError('Failed to load notes from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
    const unsubscribe = onActivityUpdate(() => {
      void fetchNotes();
    });
    return unsubscribe;
  }, [fetchNotes]);

  const handleSave = (
    noteData: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string },
  ) => {
    void (async () => {
      try {
        await notesService.saveNote(noteData);
        await fetchNotes();
      } catch {
        console.error('Error saving note.');
      }
    })();
  };

  const handleDelete = (id: string) => {
    void (async () => {
      if (confirm('Permanently delete this note?')) {
        await notesService.deleteNote(id);
        await fetchNotes();
      }
    })();
  };

  const availableTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const hasTag = typeof selectedTag === 'string' && selectedTag.trim() !== '';
    const matchesTag = hasTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });
  const hasError = typeof error === 'string' && error.trim() !== '';

  return (
    <PageWrapper wide>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <FileText className="h-7 w-7 text-amber-500 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Atomic Notes
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Capture persistent ideas, research, checklists, and rich markdown notes.
            </p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentNote(null);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-500"
          >
            <Plus className="h-4 w-4" />
            <span>Create Note</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <NoteEditor
          note={currentNote}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setCurrentNote(null);
            void fetchNotes();
          }}
        />
      ) : (
        <div className="space-y-6">
          <NoteFilters
            search={search}
            setSearch={setSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            availableTags={availableTags}
          />

          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <span className="animate-pulse text-xs font-semibold text-amber-500">
                Syncing notes from workspace...
              </span>
            </div>
          ) : hasError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <FileText className="mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No notes yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Capture ideas, research and important information.
              </p>
              <button
                onClick={() => {
                  setCurrentNote(null);
                  setIsEditing(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-500"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Note</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => {
                    setCurrentNote(n);
                    setIsEditing(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};


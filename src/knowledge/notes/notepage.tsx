// frontend/src/knowledge/notes/NotesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { notesService } from './noteservice';
import { NoteCard } from './notecard';
import { NoteEditor } from './noteeditor';
import { NoteFilters } from './notefilters';
import { PageWrapper } from '@/components/layout/PageWrapper';

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
      setError('Failed to securely load your internal node knowledge map.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const handleSave = (
    noteData: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string },
  ) => {
    void (async () => {
      try {
        await notesService.saveNote(noteData);
        setIsEditing(false);
        setCurrentNote(null);
        await fetchNotes();
      } catch {
        alert('Error updating configuration node.');
      }
    })();
  };

  const handleDelete = (id: string) => {
    void (async () => {
      if (confirm('Permanently purge this item from memory cells?')) {
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
    <PageWrapper>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Atomic Notes
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Capture persistent ideas, structures, and schemas asynchronously.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentNote(null);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-500"
          >
            + Create Note
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
              <span className="animate-pulse text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Syncing notes index...
              </span>
            </div>
          ) : hasError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No matching notes found.
              </span>
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

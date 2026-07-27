// frontend/src/knowledge/notes/NotesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { notesService } from './noteservice';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { NoteFilters } from './NoteFilters';

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
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Atomic Notes</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Capture persistent ideas, structures, and schemas asynchronously.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentNote(null);
              setIsEditing(true);
            }}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-medium text-neutral-950 shadow-lg shadow-amber-500/10 transition-colors hover:bg-amber-600"
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
        <>
          <NoteFilters
            search={search}
            setSearch={setSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            availableTags={availableTags}
          />

          {loading ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40">
              <span className="animate-pulse font-mono text-xs text-neutral-400">
                Syncing internal index cells...
              </span>
            </div>
          ) : hasError ? (
            <div className="rounded-xl border border-red-900 bg-red-950/20 p-4 font-mono text-xs text-red-400">
              {error}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 p-6 text-center">
              <span className="font-mono text-xs text-neutral-500">
                No matching knowledge shards located.
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
        </>
      )}
    </div>
  );
};

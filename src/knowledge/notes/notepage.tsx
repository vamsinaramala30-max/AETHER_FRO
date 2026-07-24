// frontend/src/knowledge/notes/NotesPage.tsx
import React, { useState, useEffect } from 'react';
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

  const fetchNotes = async () => {
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
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (noteData: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => {
    try {
      await notesService.saveNote(noteData as any);
      setIsEditing(false);
      setCurrentNote(null);
      fetchNotes();
    } catch {
      alert('Error updating configuration node.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently purge this item from memory cells?')) {
      await notesService.deleteNote(id);
      fetchNotes();
    }
  };

  const availableTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Atomic Notes</h1>
          <p className="text-xs text-neutral-400 mt-1">Capture persistent ideas, structures, and schemas asynchronously.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => { setCurrentNote(null); setIsEditing(true); }}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-medium text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-amber-500/10"
          >
            + Create Note
          </button>
        )}
      </div>

      {isEditing ? (
        <NoteEditor note={currentNote} onSave={handleSave} onCancel={() => { setIsEditing(false); setCurrentNote(null); }} />
      ) : (
        <>
          <NoteFilters search={search} setSearch={setSearch} selectedTag={selectedTag} setSelectedTag={setSelectedTag} availableTags={availableTags} />
          
          {loading ? (
            <div className="h-48 flex items-center justify-center border border-neutral-800 border-dashed rounded-xl bg-neutral-900/40">
              <span className="text-neutral-400 text-xs animate-pulse font-mono">Syncing internal index cells...</span>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-900 bg-red-950/20 text-red-400 text-xs rounded-xl font-mono">{error}</div>
          ) : filteredNotes.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center border border-neutral-800 border-dashed rounded-xl bg-neutral-900/20 text-center p-6">
              <span className="text-neutral-500 text-xs font-mono">No matching knowledge shards located.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => { setCurrentNote(n); setIsEditing(true); }}
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
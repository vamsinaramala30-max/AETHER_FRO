// frontend/src/knowledge/notes/NoteEditor.tsx
import React, { useState, useEffect } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Omit<Note, 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagInput(note.tags.join(', '));
    } else {
      setTitle('');
      setContent('');
      setTagInput('');
    }
  }, [note]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onSave({
      id: note?.id ?? '',
      title,
      content,
      tags,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <h3 className="text-sm font-medium text-white">{note ? 'Edit Note' : 'Create New Note'}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Note Title"
          required
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="Write deep insights here..."
          rows={8}
          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-sm leading-relaxed text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
          }}
          placeholder="e.g. architecture, layout, design-tokens"
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs text-neutral-400 transition-colors hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-medium text-neutral-950 shadow-lg shadow-amber-500/10 transition-colors hover:bg-amber-600"
        >
          Save Note
        </button>
      </div>
    </form>
  );
};

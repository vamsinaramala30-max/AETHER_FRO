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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onSave({
      id: note?.id,
      title,
      content,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
        <h3 className="text-white font-medium text-sm">{note ? 'Edit Note' : 'Create New Note'}</h3>
        <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-xs">
          Cancel
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); }}
          placeholder="Note Title"
          required
          className="w-full bg-neutral-950 text-white border border-neutral-800 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Content</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          placeholder="Write deep insights here..."
          rows={8}
          className="w-full bg-neutral-950 text-white border border-neutral-800 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 text-sm resize-none font-mono leading-relaxed"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Tags (comma separated)</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => { setTagInput(e.target.value); }}
          placeholder="e.g. architecture, layout, design-tokens"
          className="w-full bg-neutral-950 text-white border border-neutral-800 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 rounded-lg text-xs hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-medium rounded-lg text-xs transition-colors shadow-lg shadow-amber-500/10"
        >
          Save Note
        </button>
      </div>
    </form>
  );
};
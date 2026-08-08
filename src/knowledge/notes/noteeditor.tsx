import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { useNotificationStore } from '@/state/notificationStore';

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
    useNotificationStore.getState().addNotification({
      title: note ? 'Note Updated' : 'Note Created',
      description: `Note "${title || 'Untitled'}" was saved successfully.`,
      type: 'info',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {note ? 'Edit Note' : 'Create New Note'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Note Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. System Architecture Notes"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content here..."
          rows={8}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="e.g. architecture, layout, design-tokens"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Save Note
        </button>
      </div>
    </form>
  );
};

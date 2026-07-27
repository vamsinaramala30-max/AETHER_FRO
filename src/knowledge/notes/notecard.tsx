// frontend/src/knowledge/notes/NoteCard.tsx
import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-neutral-700">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-medium text-white transition-colors group-hover:text-amber-400">
            {note.title || 'Untitled Note'}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 text-xs text-neutral-500 transition-colors hover:text-red-400"
            title="Delete Note"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-neutral-400">
          {note.content || <span className="italic text-neutral-600">No content inside.</span>}
        </p>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {note.tags.map((t) => (
            <span
              key={t}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] text-neutral-400"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-800/60 pt-2 text-[10px] text-neutral-500">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          <button
            onClick={() => {
              onEdit(note);
            }}
            className="font-medium text-amber-500 hover:underline"
          >
            Edit →
          </button>
        </div>
      </div>
    </div>
  );
};

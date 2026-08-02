import React from 'react';
import { Note } from '../types';
import { Trash2, Edit3 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/40">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
            {note.title || 'Untitled Note'}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            title="Delete Note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mb-4 line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {note.content || <span className="italic text-slate-400">No content inside.</span>}
        </p>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {note.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-slate-200 bg-slate-100/70 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="font-medium">{new Date(note.updatedAt).toLocaleDateString()}</span>
          <button
            onClick={() => onEdit(note)}
            className="flex items-center gap-1 font-semibold text-amber-600 hover:underline dark:text-amber-400"
          >
            <Edit3 className="h-3 w-3" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-white font-medium line-clamp-1 group-hover:text-amber-400 transition-colors">{note.title || 'Untitled Note'}</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="text-neutral-500 hover:text-red-400 transition-colors text-xs p-1"
            title="Delete Note"
          >
            ✕
          </button>
        </div>
        <p className="text-neutral-400 text-xs line-clamp-4 mb-4 whitespace-pre-wrap leading-relaxed">
          {note.content || <span className="italic text-neutral-600">No content inside.</span>}
        </p>
      </div>
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.map((t) => (
            <span key={t} className="text-[10px] bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
              #{t}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-2 border-t border-neutral-800/60">
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
          <button onClick={() => { onEdit(note); }} className="text-amber-500 hover:underline font-medium">
            Edit →
          </button>
        </div>
      </div>
    </div>
  );
};
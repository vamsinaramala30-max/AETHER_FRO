// frontend/src/knowledge/documents/DocumentCard.tsx
import React from 'react';
import { DocumentItem } from '../types';

interface DocumentCardProps {
  doc: DocumentItem;
  onView: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc, onView, onDelete }) => {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex-shrink-0 text-lg text-amber-500">📄</span>
            <h3
              className="line-clamp-1 text-sm font-medium text-white transition-colors group-hover:text-amber-400"
              title={doc.name}
            >
              {doc.name}
            </h3>
          </div>
          <button
            onClick={() => {
              onDelete(doc.id);
            }}
            className="p-1 text-xs text-neutral-500 transition-colors hover:text-red-400"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 font-mono text-[10px] text-neutral-500">
          {(doc.size / 1024).toFixed(1)} KB | {doc.mimeType || 'unknown/binary'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {doc.tags.map((t) => (
            <span
              key={t}
              className="rounded border border-neutral-800 bg-neutral-950 px-1.5 py-0.5 text-[9px] text-neutral-400"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-800/60 pt-2 text-[10px]">
          <span className="text-neutral-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
          <button
            onClick={() => {
              onView(doc);
            }}
            className="font-medium text-amber-500 hover:underline"
          >
            View Cluster →
          </button>
        </div>
      </div>
    </div>
  );
};

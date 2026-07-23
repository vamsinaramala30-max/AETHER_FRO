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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-all group">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-amber-500 text-lg flex-shrink-0">📄</span>
            <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-amber-400 transition-colors" title={doc.name}>
              {doc.name}
            </h3>
          </div>
          <button onClick={() => { onDelete(doc.id); }} className="text-neutral-500 hover:text-red-400 text-xs p-1 transition-colors">✕</button>
        </div>
        <p className="text-[10px] font-mono text-neutral-500 mb-4">
          {(doc.size / 1024).toFixed(1)} KB | {doc.mimeType || 'unknown/binary'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {doc.tags.map((t) => (
            <span key={t} className="text-[9px] bg-neutral-950 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">#{t}</span>
          ))}
        </div>
        <div className="flex justify-between items-center text-[10px] pt-2 border-t border-neutral-800/60">
          <span className="text-neutral-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
          <button onClick={() => { onView(doc); }} className="text-amber-500 hover:underline font-medium">View Cluster →</button>
        </div>
      </div>
    </div>
  );
};
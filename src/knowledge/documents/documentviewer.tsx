// frontend/src/knowledge/documents/DocumentViewer.tsx
import React from 'react';
import { DocumentItem } from '../types';

interface DocumentViewerProps {
  doc: DocumentItem;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ doc, onClose }) => {
  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">📂</span>
          <div>
            <h2 className="text-sm font-medium text-white">{doc.name}</h2>
            <p className="font-mono text-[10px] text-neutral-500">ID: {doc.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <div className="mb-3 text-3xl">🛡️</div>
        <h4 className="mb-1 text-xs font-medium text-white">Encrypted Ingest Pipeline Active</h4>
        <p className="mx-auto mb-4 max-w-md text-[11px] leading-relaxed text-neutral-400">
          File system parsing sandbox container blocks direct inline preview frames for security.
        </p>
        <a
          href={doc.url}
          download={doc.name}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 font-mono text-xs text-amber-500 transition-colors hover:text-amber-400"
        >
          Download & Verify Signature File
        </a>
      </div>
    </div>
  );
};

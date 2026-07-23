// frontend/src/knowledge/documents/DocumentViewer.tsx
import React from 'react';
import { DocumentItem } from '../types';

interface DocumentViewerProps {
  doc: DocumentItem;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ doc, onClose }) => {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">📂</span>
          <div>
            <h2 className="text-white font-medium text-sm">{doc.name}</h2>
            <p className="text-[10px] text-neutral-500 font-mono">ID: {doc.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white text-xs px-3 py-1 bg-neutral-900 rounded border border-neutral-800">Close</button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
        <div className="text-3xl mb-3">🛡️</div>
        <h4 className="text-white text-xs font-medium mb-1">Encrypted Ingest Pipeline Active</h4>
        <p className="text-[11px] text-neutral-400 max-w-md mx-auto mb-4 leading-relaxed">
          File system parsing sandbox container blocks direct inline preview frames for security.
        </p>
        <a
          href={doc.url}
          download={doc.name}
          className="bg-neutral-950 border border-neutral-800 text-amber-500 hover:text-amber-400 px-4 py-2 rounded-lg text-xs font-mono transition-colors"
        >
          Download & Verify Signature File
        </a>
      </div>
    </div>
  );
};
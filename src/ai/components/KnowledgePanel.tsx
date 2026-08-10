// ============================================================================
// AETHER AI — KnowledgePanel Component
// ============================================================================

import React, { memo, useRef } from 'react';
import type { AIDocument, DocumentStatus } from '../ai-types';
import { useKnowledge } from '../hooks/useKnowledge';
import { getDocumentStatusLabel } from '../rag/document-parser';

const STATUS_COLORS: Record<DocumentStatus, string> = {
  pending: 'text-slate-400',
  parsing: 'text-amber-400',
  chunking: 'text-amber-400',
  embedding: 'text-blue-400',
  indexed: 'text-emerald-400',
  error: 'text-red-400',
};

interface DocumentRowProps {
  document: AIDocument;
  onDelete: (id: string) => void;
}

const DocumentRow = memo<DocumentRowProps>(({ document: doc, onDelete }) => (
  <div className="group flex items-start gap-3 rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
    <div
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-slate-400"
      aria-hidden="true"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-medium text-slate-200">{doc.name}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <span className={`text-[10px] font-medium ${STATUS_COLORS[doc.status]}`}>
          {getDocumentStatusLabel(doc.status)}
        </span>
        {doc.chunkCount !== undefined && doc.status === 'indexed' && (
          <>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">{doc.chunkCount} chunks</span>
          </>
        )}
      </div>
      {doc.error && <p className="mt-1 text-[10px] text-red-400">{doc.error}</p>}
    </div>
    <button
      type="button"
      onClick={() => onDelete(doc.id)}
      aria-label={`Delete document: ${doc.name}`}
      className="mt-0.5 shrink-0 rounded p-1 text-slate-600 opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 focus:outline-none focus-visible:opacity-100"
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
));

DocumentRow.displayName = 'DocumentRow';

/**
 * KnowledgePanel — Displays knowledge base documents and RAG status.
 * Supports document upload and deletion.
 */
export const KnowledgePanel = memo(() => {
  const { documents, ragStatus, uploadDocument, deleteDocument, refresh } = useKnowledge();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      await uploadDocument(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="flex flex-col gap-4" aria-labelledby="knowledge-panel-heading">
      <div className="flex items-center justify-between">
        <h2 id="knowledge-panel-heading" className="text-sm font-semibold text-slate-200">
          Knowledge Base
        </h2>
        <button
          type="button"
          onClick={() => void refresh()}
          aria-label="Refresh knowledge"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 focus:outline-none"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* RAG Status */}
      {ragStatus && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-base font-bold text-emerald-400">{ragStatus.indexedCount}</p>
            <p className="text-[10px] text-slate-500">Indexed</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-2 text-center">
            <p className="text-base font-bold text-slate-300">{ragStatus.documentCount}</p>
            <p className="text-[10px] text-slate-500">Total Docs</p>
          </div>
        </div>
      )}

      {/* Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          id="knowledge-file-upload"
          className="sr-only"
          multiple
          accept=".pdf,.txt,.md,.docx,.csv"
          onChange={(e) => void handleFileChange(e)}
          aria-label="Upload documents"
        />
        <label
          htmlFor="knowledge-file-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-400 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Upload Documents
        </label>
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/20 p-6 text-center">
          <p className="text-xs text-slate-500">No documents indexed.</p>
          <p className="mt-1 text-[11px] text-slate-600">Upload documents to enable RAG retrieval.</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Knowledge documents">
          {documents.map((doc) => (
            <li key={doc.id}>
              <DocumentRow document={doc} onDelete={(id) => void deleteDocument(id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

KnowledgePanel.displayName = 'KnowledgePanel';

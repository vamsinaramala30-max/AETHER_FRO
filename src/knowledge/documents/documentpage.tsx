import React, { useState, useEffect, useCallback } from 'react';
import { DocumentItem } from '../types';
import { documentsService } from './documentservice';
import { FileUpload } from './fileupload';
import { DocumentCard } from './documentcard';
import { DocumentViewer } from './documentviewer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FileText, FolderPlus } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentsService.getDocuments();
      setDocs(data);
    } catch {
      console.error('Failed processing files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDocs();
  }, [fetchDocs]);

  const handleUploadComplete = (file: File, tags: string[]) => {
    void (async () => {
      await documentsService.uploadDocument(file, tags);
      await fetchDocs();
    })();
  };

  const handleDelete = (id: string) => {
    void (async () => {
      if (confirm('Delete this document from vault?')) {
        await documentsService.deleteDocument(id);
        if (viewingDoc?.id === id) setViewingDoc(null);
        await fetchDocs();
      }
    })();
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Document Vault
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload, index, and organize files and PDFs for knowledge embeddings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          {viewingDoc ? (
            <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
          ) : loading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-xs font-semibold text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400">
              <span className="animate-pulse">Loading documents vault...</span>
            </div>
          ) : docs.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
              <FolderPlus className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No documents uploaded to vault yet.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onView={setViewingDoc}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

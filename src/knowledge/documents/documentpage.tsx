// frontend/src/knowledge/documents/DocumentsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { DocumentItem } from '../types';
import { documentsService } from './documentservice';
import { FileUpload } from './fileupload';
import { DocumentCard } from './documentcard';
import { DocumentViewer } from './documentviewer';

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
      console.error('Failed processing isolated files map');
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
      if (confirm('Purge structural resource asset block?')) {
        await documentsService.deleteDocument(id);
        if (viewingDoc?.id === id) setViewingDoc(null);
        await fetchDocs();
      }
    })();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Structured Vault</h1>
        <p className="mt-1 text-xs text-neutral-400">
          Upload and map binary document objects securely onto vector graphs.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          {viewingDoc ? (
            <DocumentViewer
              doc={viewingDoc}
              onClose={() => {
                setViewingDoc(null);
              }}
            />
          ) : loading ? (
            <div className="flex h-48 animate-pulse items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 font-mono text-xs text-neutral-400">
              Parsing encrypted blocks storage...
            </div>
          ) : docs.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 p-6 text-center">
              <span className="font-mono text-xs text-neutral-500">
                No objects stored inside vault container yet.
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
    </div>
  );
};

// frontend/src/knowledge/documents/DocumentsPage.tsx
import React, { useState, useEffect } from 'react';
import { DocumentItem } from '../types';
import { documentsService } from './documentservice';
import { FileUpload } from './FileUpload';
import { DocumentCard } from './DocumentCard';
import { DocumentViewer } from './DocumentViewer';

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await documentsService.getDocuments();
      setDocs(data);
    } catch {
      console.error('Failed processing isolated files map');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUploadComplete = async (file: File, tags: string[]) => {
    await documentsService.uploadDocument(file, tags);
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Purge structural resource asset block?')) {
      await documentsService.deleteDocument(id);
      if (viewingDoc?.id === id) setViewingDoc(null);
      fetchDocs();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Structured Vault</h1>
        <p className="text-xs text-neutral-400 mt-1">Upload and map binary document objects securely onto vector graphs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          {viewingDoc ? (
            <DocumentViewer doc={viewingDoc} onClose={() => { setViewingDoc(null); }} />
          ) : loading ? (
            <div className="h-48 flex items-center justify-center border border-neutral-800 border-dashed rounded-xl bg-neutral-900/40 font-mono text-xs text-neutral-400 animate-pulse">
              Parsing encrypted blocks storage...
            </div>
          ) : docs.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center border border-neutral-800 border-dashed rounded-xl bg-neutral-900/20 text-center p-6">
              <span className="text-neutral-500 text-xs font-mono">No objects stored inside vault container yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} onView={setViewingDoc} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentItem } from '../types';
import { documentsService } from './documentservice';
import { DocumentCard } from './documentcard';
import { DocumentViewer } from './documentviewer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FileText, FolderPlus, Plus, Search, Paperclip, X } from 'lucide-react';
import { AttachFileModal, StorageFile } from '@/shared/AttachFileModal';
import { onActivityUpdate } from '@/shared/activityEvents';

export type DocumentCategory =
  | 'All Documents'
  | 'Notes'
  | 'Reports'
  | 'Meeting Notes'
  | 'Project Documents'
  | 'AI-generated Documents';

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('All Documents');
  const [search, setSearch] = useState('');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  // New Document modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Reports');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<StorageFile[]>([]);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const categories: DocumentCategory[] = [
    'All Documents',
    'Notes',
    'Reports',
    'Meeting Notes',
    'Project Documents',
    'AI-generated Documents',
  ];

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await documentsService.getDocuments();
      setDocs(data);
    } catch {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDocs();
    const unsubscribe = onActivityUpdate(() => {
      void fetchDocs();
    });
    return unsubscribe;
  }, [fetchDocs]);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchesCategory =
        selectedCategory === 'All Documents' ||
        (doc.category && doc.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        (doc.content && doc.content.toLowerCase().includes(search.toLowerCase())) ||
        doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [docs, selectedCategory, search]);

  const handleCreateDocument = async () => {
    if (!newTitle.trim()) return;
    const tagArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const fileIds = attachedFiles.map((f) => f.id);

    await documentsService.createDocument({
      title: newTitle,
      category: newCategory,
      content: newContent,
      tags: tagArray,
      attachedFileIds: fileIds,
    });

    setIsCreateOpen(false);
    setNewTitle('');
    setNewCategory('Reports');
    setNewContent('');
    setNewTags('');
    setAttachedFiles([]);
    await fetchDocs();
  };

  const handleDelete = (id: string) => {
    void (async () => {
      if (
        confirm(
          'Delete this document? Attached raw files will remain safely stored in Workspace Files.',
        )
      ) {
        await documentsService.deleteDocument(id);
        if (viewingDoc?.id === id) setViewingDoc(null);
        await fetchDocs();
      }
    })();
  };

  return (
    <PageWrapper wide>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <FileText className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Document Vault
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Structured workspace documents, reports, meeting notes, and AI summaries.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" />
          <span>Create Document</span>
        </button>
      </div>

      {/* Category Filter Tabs INSIDE Documents Page */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mt-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents by title, tags, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Document View / Grid */}
      <div className="mt-6">
        {viewingDoc ? (
          <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
        ) : loading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-xs font-semibold text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400">
            <span className="animate-pulse">Loading document vault...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <FolderPlus className="mb-3 h-10 w-10 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No documents yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Create structured documents for your work in {selectedCategory}.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onView={setViewingDoc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* CREATE DOCUMENT MODAL */}
      {isCreateOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-150">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Structured Document
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-medium">
              <div>
                <label className="mb-1 block text-slate-600 dark:text-slate-300">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Q3 Progress Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-slate-600 dark:text-slate-300">
                  Document Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Reports">Reports</option>
                  <option value="Meeting Notes">Meeting Notes</option>
                  <option value="Project Documents">Project Documents</option>
                  <option value="Notes">Notes</option>
                  <option value="AI-generated Documents">AI-generated Documents</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-slate-600 dark:text-slate-300">
                  Structured Content
                </label>
                <textarea
                  rows={5}
                  placeholder="Enter detailed document content, specifications, or summary..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-normal text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-slate-600 dark:text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. report, quarterly, project"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Attach Existing File from Workspace Files */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Attached Raw Workspace Files ({attachedFiles.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAttachModalOpen(true)}
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-500"
                  >
                    + Attach existing file
                  </button>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800"
                      >
                        <span className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                          {f.filename}
                        </span>
                        <button
                          onClick={() =>
                            setAttachedFiles((prev) => prev.filter((item) => item.id !== f.id))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreateDocument()}
                disabled={!newTitle.trim()}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach File Modal */}
      <AttachFileModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        selectedFileIds={attachedFiles.map((f) => f.id)}
        onSelectFile={(file) => {
          if (!attachedFiles.some((f) => f.id === file.id)) {
            setAttachedFiles((prev) => [...prev, file]);
          }
        }}
      />
    </PageWrapper>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, StickyNote, Database, Search, ArrowRight, Plus } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { documentsService } from './documents/documentservice';
import { notesService } from './notes/notesService';
import { DocumentItem } from './types';
import { Page as NotePage } from './notes/notes.types';
import { EmptyState } from '@/components/ui/EmptyState';

export const KnowledgePage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [notes, setNotes] = useState<NotePage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadKnowledge = async () => {
      try {
        const [fetchedDocs, fetchedNotes] = await Promise.all([
          documentsService.getDocuments().catch(() => []),
          notesService.getPages().catch(() => []),
        ]);
        if (isMounted) {
          setDocuments(Array.isArray(fetchedDocs) ? fetchedDocs : []);
          setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : []);
        }
      } catch {
        if (isMounted) {
          setDocuments([]);
          setNotes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    void loadKnowledge();
    return () => {
      isMounted = false;
    };
  }, []);

  const knowledgeModules = [
    {
      href: '/app/knowledge/documents',
      icon: FileText,
      label: 'Documents',
      description: 'Uploaded files, PDFs, and structured reference manuals.',
      color:
        'from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-600/20 dark:to-green-600/20',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      count: loading ? 'Loading...' : `${documents.length} doc${documents.length === 1 ? '' : 's'}`,
    },
    {
      href: '/app/knowledge/notes',
      icon: StickyNote,
      label: 'Notes',
      description: 'Quick notes, conceptual drafts, and captured thoughts.',
      color:
        'from-amber-500/10 via-yellow-500/10 to-transparent dark:from-amber-600/20 dark:to-yellow-600/20',
      border: 'border-amber-200 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      count: loading ? 'Loading...' : `${notes.length} note${notes.length === 1 ? '' : 's'}`,
    },
    {
      href: '/app/knowledge/base',
      icon: Database,
      label: 'Knowledge Base',
      description: 'Connected graph network and structured relation maps.',
      color:
        'from-blue-500/10 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:to-indigo-600/20',
      border: 'border-blue-200 dark:border-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      count: loading ? 'Loading...' : 'Graph & Relations',
    },
    {
      href: '/app/knowledge/search',
      icon: Search,
      label: 'Search',
      description: 'Fast semantic discovery and unified document indexing.',
      color:
        'from-purple-500/10 via-indigo-500/10 to-transparent dark:from-purple-600/20 dark:to-indigo-600/20',
      border: 'border-purple-200 dark:border-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      count: 'Semantic Index',
    },
  ];

  const recentAssets = [
    ...documents.slice(0, 4).map((d) => ({
      id: d.id,
      name: d.name,
      type: 'Document',
      time: new Date(d.updatedAt || d.createdAt).toLocaleDateString(),
      href: '/app/knowledge/documents',
    })),
    ...notes.slice(0, 4).map((n) => ({
      id: n.id,
      name: n.title,
      type: 'Note',
      time: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Recent',
      href: '/app/knowledge/notes',
    })),
  ].slice(0, 5);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-aether-border pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-aether-main">
              Knowledge
            </h1>
            <p className="text-sm text-aether-muted">
              Unified knowledge repository, structured notes, relations graph & semantic search
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/knowledge/documents"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Upload Document
          </Link>
          <Link
            to="/app/knowledge/notes"
            className="inline-flex items-center gap-1.5 rounded-xl border border-aether-border bg-aether-surface px-3.5 py-2 text-xs font-semibold text-aether-main shadow-sm transition-colors hover:bg-aether-subtle"
          >
            <Plus className="h-3.5 w-3.5" />
            New Note
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {knowledgeModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              to={mod.href}
              className={`group flex flex-col justify-between rounded-2xl bg-aether-surface bg-gradient-to-br p-5 ${mod.color} border ${mod.border} shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-6 w-6 ${mod.iconColor} shrink-0`} />
                <span className="rounded-full border border-aether-border bg-aether-subtle px-2.5 py-0.5 text-xs font-semibold text-aether-muted">
                  {mod.count}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 text-base font-bold text-aether-main transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {mod.label}
                </h3>
                <p className="text-xs leading-relaxed text-aether-muted">
                  {mod.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Assets */}
      <div className="rounded-2xl border border-aether-border bg-aether-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-aether-main">
            Recently Added Knowledge Assets
          </h2>
          {recentAssets.length > 0 && (
            <Link
              to="/app/knowledge/documents"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-aether-subtle" />
            ))}
          </div>
        ) : recentAssets.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No knowledge assets yet"
            description="Your knowledge repository is currently empty. Upload your first document or capture notes to begin building your second brain."
          />
        ) : (
          <div className="space-y-2">
            {recentAssets.map((doc) => (
              <Link
                key={doc.id}
                to={doc.href}
                className="flex items-center gap-3.5 rounded-xl border border-aether-border/60 bg-aether-subtle/30 p-3.5 transition-all hover:bg-aether-subtle/80 hover:border-aether-border"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-aether-main">
                    {doc.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-aether-muted">
                    {doc.type} · {doc.time}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-aether-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default KnowledgePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, StickyNote, Database, ArrowRight } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

const KNOWLEDGE_MODULES = [
  {
    href: '/app/knowledge/documents',
    icon: FileText,
    label: 'Documents',
    description: 'Uploaded files, PDFs, and rich documents.',
    color:
      'from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-600/20 dark:to-green-600/20',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    count: '24 docs',
  },
  {
    href: '/app/knowledge/notes',
    icon: StickyNote,
    label: 'Notes',
    description: 'Quick notes, ideas, and captured thoughts.',
    color:
      'from-amber-500/10 via-yellow-500/10 to-transparent dark:from-amber-600/20 dark:to-yellow-600/20',
    border: 'border-amber-200 dark:border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    count: '12 notes',
  },
  {
    href: '/app/knowledge/base',
    icon: Database,
    label: 'Knowledge Base',
    description: 'Structured collections with AI embeddings.',
    color:
      'from-blue-500/10 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:to-indigo-600/20',
    border: 'border-blue-200 dark:border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    count: '3 bases',
  },
];

export const KnowledgePage: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Knowledge
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your personal knowledge management system & semantic search hub
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {KNOWLEDGE_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              to={mod.href}
              className={`group flex flex-col gap-4 rounded-2xl bg-white bg-gradient-to-br p-6 dark:bg-slate-900 ${mod.color} border ${mod.border} shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-6 w-6 ${mod.iconColor} shrink-0`} />
                {mod.count && (
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {mod.count}
                  </span>
                )}
              </div>
              <div>
                <h3 className="mb-1 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {mod.label}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {mod.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Docs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
          Recently Added Assets
        </h2>
        <div className="space-y-2">
          {[
            { name: 'Product Requirements v2.3', type: 'PDF', time: '2h ago' },
            { name: 'Architecture Notes', type: 'Note', time: '1d ago' },
            { name: 'API Documentation', type: 'Doc', time: '2d ago' },
          ].map((doc) => (
            <div
              key={doc.name}
              className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-slate-100 p-3.5 transition-all hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                  {doc.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  {doc.type} · {doc.time}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default KnowledgePage;

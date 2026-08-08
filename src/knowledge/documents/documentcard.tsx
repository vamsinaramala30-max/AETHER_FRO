import React from 'react';
import { DocumentItem } from '../types';
import { FileText, Trash2, ArrowRight } from 'lucide-react';

interface DocumentCardProps {
  doc: DocumentItem;
  onView: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc, onView, onDelete }) => {
  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <h3
              className="line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
              title={doc.name}
            >
              {doc.name}
            </h3>
          </div>
          <button
            onClick={() => onDelete(doc.id)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {(doc.size / 1024).toFixed(1)} KB · {doc.mimeType || 'Document'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {doc.tags.map((t) => (
            <span
              key={t}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
            >
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <span className="font-medium text-slate-400">
            {new Date(doc.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => onView(doc)}
            className="flex items-center gap-1 font-bold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View Document <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

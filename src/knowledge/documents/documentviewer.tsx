import React from 'react';
import { DocumentItem } from '../types';
import { FileText, Download, X } from 'lucide-react';

interface DocumentViewerProps {
  doc: DocumentItem;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ doc, onClose }) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h2>
            <p className="text-[11px] font-semibold text-slate-400">ID: {doc.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800/80 dark:bg-slate-800/30">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
          <FileText className="h-6 w-6" />
        </div>
        <h4 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
          Document Preview Ready
        </h4>
        <p className="mx-auto mb-5 max-w-md text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
          You can inspect the contents directly or download the file for full editing.
        </p>
        <a
          href={doc.url}
          download={doc.name}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
        >
          <Download className="h-4 w-4" />
          Download File
        </a>
      </div>
    </div>
  );
};

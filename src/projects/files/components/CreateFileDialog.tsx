import React, { useState, useEffect } from 'react';
import { X, FileText, FileCode, FileSpreadsheet, Loader2 } from 'lucide-react';
import { fileManagerApi } from '../fileManagerApi';
import { useNotificationStore } from '@/state/notificationStore';

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'markdown' | 'text' | 'code' | 'spreadsheet';
  currentFolderId: string | null;
  projectId?: string;
  onCreated: (newFile: any) => void;
}

export const CreateFileDialog: React.FC<CreateFileDialogProps> = ({
  isOpen,
  onClose,
  initialType = 'markdown',
  currentFolderId,
  projectId,
  onCreated,
}) => {
  const [fileType, setFileType] = useState<'markdown' | 'text' | 'code' | 'spreadsheet'>(
    initialType,
  );
  const [filename, setFilename] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setFileType(initialType);
      switch (initialType) {
        case 'markdown':
          setFilename('Document.md');
          setContent('# New Document\n\nCreated in AETHER File Manager.\n');
          break;
        case 'text':
          setFilename('Note.txt');
          setContent('Workspace Note\n');
          break;
        case 'code':
          setFilename('script.ts');
          setContent('// AETHER Script\nexport function main() {\n  console.log("Ready");\n}\n');
          break;
        case 'spreadsheet':
          setFilename('Sheet.csv');
          setContent('ID,Name,Category,Value\n1,Alpha,Core,100\n2,Beta,Edge,250\n');
          break;
      }
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleTypeChange = (type: 'markdown' | 'text' | 'code' | 'spreadsheet') => {
    setFileType(type);
    const base = filename.replace(/\.[^/.]+$/, '');
    switch (type) {
      case 'markdown':
        setFilename(`${base || 'Document'}.md`);
        setContent('# New Document\n\nCreated in AETHER File Manager.\n');
        break;
      case 'text':
        setFilename(`${base || 'Note'}.txt`);
        setContent('Workspace Note\n');
        break;
      case 'code':
        setFilename(`${base || 'script'}.ts`);
        setContent('// AETHER Script\nexport function main() {\n  console.log("Ready");\n}\n');
        break;
      case 'spreadsheet':
        setFilename(`${base || 'Sheet'}.csv`);
        setContent('ID,Name,Category,Value\n1,Alpha,Core,100\n2,Beta,Edge,250\n');
        break;
    }
  };

  const handleCreate = async () => {
    if (!filename.trim()) return;
    setCreating(true);
    try {
      const res = await fileManagerApi.createEmptyFile({
        filename: filename.trim(),
        content,
        folderId: currentFolderId,
        projectId,
      });

      useNotificationStore.getState().addNotification({
        title: 'File Created',
        description: `"${filename}" created successfully.`,
        type: 'project',
      });
      onCreated(res);
      onClose();
    } catch (err: any) {
      useNotificationStore.getState().addNotification({
        title: 'Creation Failed',
        description: err?.message || 'Failed to create file on server.',
        type: 'project',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New File</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly create and initialize a file in this folder.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          {/* Format selector buttons */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Format
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('markdown')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  fileType === 'markdown'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Markdown (.md)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('text')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  fileType === 'text'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Text Note (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('code')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  fileType === 'code'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <FileCode className="h-4 w-4 text-purple-500" />
                <span>Code Script (.ts)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('spreadsheet')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  fileType === 'spreadsheet'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span>Spreadsheet (.csv)</span>
              </button>
            </div>
          </div>

          {/* Filename input */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. Analysis.md"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200/80 p-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleCreate()}
            disabled={creating || !filename.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            <span>Create File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

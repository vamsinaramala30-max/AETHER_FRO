import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FolderPlus,
  Upload,
  Folder,
  FileText,
  Trash2,
  PieChart,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FileItem, FolderItem, FileManagerSection, FileCategory } from '../types';

interface FileCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
  folders: FolderItem[];
  onSelectFile: (file: FileItem) => void;
  onSelectFolder: (folderId: string) => void;
  onSelectSection: (section: FileManagerSection) => void;
  onSelectCategory: (cat: FileCategory) => void;
  onCreateFolder: () => void;
  onUploadFile: () => void;
  onOpenStorageInsights: () => void;
  onScanDuplicates: () => void;
}

export const FileCommandBar: React.FC<FileCommandBarProps> = ({
  isOpen,
  onClose,
  files,
  folders,
  onSelectFile,
  onSelectFolder,
  onSelectSection,
  onSelectCategory,
  onCreateFolder,
  onUploadFile,
  onOpenStorageInsights,
  onScanDuplicates,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'action-new-folder',
      title: 'Create New Folder',
      icon: <FolderPlus className="h-4 w-4 text-amber-500" />,
      run: () => {
        onClose();
        onCreateFolder();
      },
    },
    {
      id: 'action-upload',
      title: 'Upload File',
      icon: <Upload className="h-4 w-4 text-indigo-500" />,
      run: () => {
        onClose();
        onUploadFile();
      },
    },
    {
      id: 'action-my-files',
      title: 'Go to My Files',
      icon: <Folder className="h-4 w-4 text-blue-500" />,
      run: () => {
        onClose();
        onSelectSection('my-files');
      },
    },
    {
      id: 'action-project-files',
      title: 'Go to Project Files',
      icon: <Folder className="h-4 w-4 text-emerald-500" />,
      run: () => {
        onClose();
        onSelectSection('projects');
      },
    },
    {
      id: 'action-trash',
      title: 'Go to Trash',
      icon: <Trash2 className="h-4 w-4 text-red-500" />,
      run: () => {
        onClose();
        onSelectSection('trash');
      },
    },
    {
      id: 'action-storage',
      title: 'Open Storage Insights',
      icon: <PieChart className="h-4 w-4 text-emerald-500" />,
      run: () => {
        onClose();
        onOpenStorageInsights();
      },
    },
    {
      id: 'action-duplicates',
      title: 'Scan Duplicate Files',
      icon: <Copy className="h-4 w-4 text-indigo-400" />,
      run: () => {
        onClose();
        onScanDuplicates();
      },
    },
    {
      id: 'action-pdfs',
      title: 'Filter: Show only PDFs',
      icon: <FileText className="h-4 w-4 text-rose-500" />,
      run: () => {
        onClose();
        onSelectCategory('PDFs');
      },
    },
    {
      id: 'action-code',
      title: 'Filter: Show only Code Files',
      icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
      run: () => {
        onClose();
        onSelectCategory('Code');
      },
    },
  ];

  const filteredActions = quickActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredFolders = folders
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const filteredFiles = files
    .filter((f) => f.filename.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  const allItems: Array<{
    type: 'action' | 'folder' | 'file';
    item: any;
    key: string;
  }> = [
    ...filteredActions.map((a) => ({ type: 'action' as const, item: a, key: a.id })),
    ...filteredFolders.map((f) => ({ type: 'folder' as const, item: f, key: f.id })),
    ...filteredFiles.map((file) => ({ type: 'file' as const, item: file, key: file.id })),
  ];

  const handleSelect = (idx: number) => {
    const entry = allItems[idx];
    if (!entry) return;
    if (entry.type === 'action') {
      entry.item.run();
    } else if (entry.type === 'folder') {
      onClose();
      onSelectFolder(entry.item.id);
    } else if (entry.type === 'file') {
      onClose();
      onSelectFile(entry.item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-20 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        {/* Search header */}
        <div className="flex items-center border-b border-slate-200/80 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, file name, or action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="ml-3 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching files, folders, or actions found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredActions.length > 0 && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Actions
                </p>
              )}
              {filteredActions.map((action, i) => {
                const idx = i;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {action.icon}
                      <span>{action.title}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                );
              })}

              {filteredFolders.length > 0 && (
                <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Folders
                </p>
              )}
              {filteredFolders.map((folder, i) => {
                const idx = filteredActions.length + i;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={folder.id}
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="h-4 w-4 text-amber-500" />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-[10px] opacity-70">Folder</span>
                  </button>
                );
              })}

              {filteredFiles.length > 0 && (
                <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Files
                </p>
              )}
              {filteredFiles.map((file, i) => {
                const idx = filteredActions.length + filteredFolders.length + i;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={file.id}
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{file.filename}</span>
                    </div>
                    <span className="text-[10px] opacity-70">Open Preview</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

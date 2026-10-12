import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  FolderPlus,
  Upload,
  FileText,
  FileCode,
  FileSpreadsheet,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  RefreshCw,
  Copy,
  FolderEdit,
  Trash2,
  X,
  Command,
} from 'lucide-react';
import { FileCategory, FileManagerSection, FolderBreadcrumb } from '../types';

interface FileManagerToolbarProps {
  activeSection: FileManagerSection;
  breadcrumbs: FolderBreadcrumb[];
  onNavigateBreadcrumb: (index: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateFolderClick: () => void;
  onCreateFileClick: (type: 'markdown' | 'text' | 'code' | 'spreadsheet') => void;
  onUploadClick: () => void;
  onRefresh: () => void;
  onScanDuplicates: () => void;
  onOpenCommandBar: () => void;
  currentFolderId: string | null;
  onRenameCurrentFolder?: () => void;
  onDeleteCurrentFolder?: () => void;
}

export const FileManagerToolbar: React.FC<FileManagerToolbarProps> = ({
  activeSection,
  breadcrumbs,
  onNavigateBreadcrumb,
  search,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  viewMode,
  onViewModeChange,
  onCreateFolderClick,
  onCreateFileClick,
  onUploadClick,
  onRefresh,
  onScanDuplicates,
  onOpenCommandBar,
  currentFolderId,
  onRenameCurrentFolder,
  onDeleteCurrentFolder,
}) => {
  const [newMenuOpen, setNewMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: FileCategory[] = [
    'All Files',
    'Documents',
    'PDFs',
    'Images',
    'Spreadsheets',
    'Presentations',
    'Code',
    'Media',
    'Archives',
  ];

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'projects':
        return 'Project Files';
      case 'trash':
        return 'Trash';
      default:
        return 'My Files';
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Bar: Breadcrumb + Action Controls */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <button
            onClick={() => onNavigateBreadcrumb(-1)}
            className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {getSectionTitle()}
          </button>

          {activeSection === 'my-files' &&
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id || idx}>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <button
                  onClick={() => onNavigateBreadcrumb(idx)}
                  className={`rounded-lg px-2 py-1 transition-colors ${
                    idx === breadcrumbs.length - 1
                      ? 'font-bold text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}

          {/* Current folder contextual tools */}
          {activeSection === 'my-files' && currentFolderId && (
            <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800">
              {onRenameCurrentFolder && (
                <button
                  onClick={onRenameCurrentFolder}
                  title="Rename current folder"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
                >
                  <FolderEdit className="h-3.5 w-3.5" />
                </button>
              )}
              {onDeleteCurrentFolder && (
                <button
                  onClick={onDeleteCurrentFolder}
                  title="Delete current folder"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right side: + New Button & Utility actions */}
        <div className="flex items-center gap-2">
          {/* Scan Duplicates */}
          <button
            onClick={onScanDuplicates}
            title="Scan for duplicate files"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Copy className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden md:inline">Duplicates</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh files"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Grid/List switch */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded-lg p-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`rounded-lg p-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* + NEW Dropdown Menu */}
          {activeSection !== 'trash' && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setNewMenuOpen(!newMenuOpen)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-98"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
              </button>

              {newMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900">
                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onCreateFolderClick();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FolderPlus className="h-4 w-4 text-amber-500" />
                    <span>New folder</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onUploadClick();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Upload className="h-4 w-4 text-indigo-500" />
                    <span>Upload files</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onCreateFileClick('markdown');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span>Markdown document (.md)</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onCreateFileClick('text');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>Text note (.txt)</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onCreateFileClick('code');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FileCode className="h-4 w-4 text-purple-500" />
                    <span>Code file (.ts / .py / .json)</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewMenuOpen(false);
                      onCreateFileClick('spreadsheet');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    <span>Spreadsheet (.csv)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle Bar: Search input + Command Bar Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search files by name, type, content..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-20 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          {search ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {/* Quick command badge */}
          <button
            onClick={onOpenCommandBar}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/80 pb-3 dark:border-slate-800/80">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import {
  Folder,
  FolderOpen,
  FolderGit2,
  Trash2,
  HardDrive,
  ChevronRight,
  ChevronDown,
  Plus,
  PieChart,
} from 'lucide-react';
import { FileManagerSection, FolderItem, StorageInsights } from '../types';

interface FileManagerSidebarProps {
  activeSection: FileManagerSection;
  onSelectSection: (section: FileManagerSection) => void;
  folders: FolderItem[];
  currentFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolderClick: () => void;
  storageInsights: StorageInsights | null;
  onOpenStorageInsights: () => void;
  trashCount?: number;
}

export const FileManagerSidebar: React.FC<FileManagerSidebarProps> = ({
  activeSection,
  onSelectSection,
  folders,
  currentFolderId,
  onSelectFolder,
  onCreateFolderClick,
  storageInsights,
  onOpenStorageInsights,
  trashCount = 0,
}) => {
  const [foldersExpanded, setFoldersExpanded] = React.useState<boolean>(true);

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const navItems: Array<{
    id: FileManagerSection;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'my-files',
      label: 'My Files',
      icon: <FolderOpen className="h-4 w-4" />,
    },
    {
      id: 'projects',
      label: 'Project Files',
      icon: <FolderGit2 className="h-4 w-4" />,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: <Trash2 className="h-4 w-4" />,
      badge: trashCount > 0 ? trashCount : undefined,
    },
  ];

  return (
    <aside className="flex w-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 lg:w-64 lg:shrink-0">
      <div className="space-y-4">
        {/* Navigation Sections */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Explorer
          </p>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  if (item.id === 'my-files') {
                    onSelectFolder(null);
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-600'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Folders Tree (Under My Files) */}
        {activeSection === 'my-files' && (
          <div className="pt-2">
            <div className="flex items-center justify-between px-3 pb-1">
              <button
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                {foldersExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span>Folders ({folders.length})</span>
              </button>
              <button
                onClick={onCreateFolderClick}
                title="Create Folder"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {foldersExpanded && (
              <div className="mt-1 space-y-0.5 pl-1">
                <button
                  onClick={() => onSelectFolder(null)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    currentFolderId === null
                      ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <HardDrive className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate">Root (All Files)</span>
                </button>

                {folders.length === 0 ? (
                  <p className="px-3 py-2 text-[11px] italic text-slate-400">No subfolders yet</p>
                ) : (
                  folders.map((folder) => {
                    const isSelected = currentFolderId === folder.id;
                    return (
                      <button
                        key={folder.id}
                        onClick={() => onSelectFolder(folder.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        {folder.fileCount !== undefined && folder.fileCount > 0 && (
                          <span className="text-[10px] text-slate-400 group-hover:text-slate-500">
                            {folder.fileCount}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Storage Insights Mini Card */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Storage</span>
          </div>
          <button
            onClick={onOpenStorageInsights}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Insights
          </button>
        </div>

        <div className="mt-2.5">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Used</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatSize(storageInsights?.usedBytes ?? storageInsights?.totalBytes ?? 0)} / {formatSize(storageInsights?.quotaBytes || 128 * 1024 * 1024 * 1024)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
              style={{
                width: `${Math.min(100, Math.max(storageInsights?.usedBytes ? 1 : 0, storageInsights?.usagePercentage ?? 0))}%`,
              }}
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            {storageInsights?.totalFiles || 0} active files · {(storageInsights?.usagePercentage ?? 0).toFixed(1)}% used
          </p>
        </div>
      </div>
    </aside>
  );
};

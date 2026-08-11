import React, { useState, useEffect } from 'react';
import { Search, FileText, Image as ImageIcon, Video, Music, Check, X, FolderOpen } from 'lucide-react';
import { apiClient } from '@/api/client';

export interface StorageFile {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface AttachFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: StorageFile) => void;
  selectedFileIds?: string[];
}

export const AttachFileModal: React.FC<AttachFileModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  selectedFileIds = [],
}) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<any>(`/uploads?search=${encodeURIComponent(search)}&limit=50`);
        const payload = data.data || data;
        const rawFiles = Array.isArray(payload) ? payload : payload?.files || payload?.data || [];
        if (Array.isArray(rawFiles)) {
          setFiles(
            rawFiles.map((f: any) => ({
              id: f.id,
              filename: f.filename || f.originalname || 'Untitled File',
              mimeType: f.mimeType || f.mimetype || 'application/octet-stream',
              size: f.size || 0,
              createdAt: f.createdAt || new Date().toISOString(),
            })),
          );
        }
      } catch {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    void fetchFiles();
  }, [isOpen, search]);

  if (!isOpen) return null;

  const getIcon = (mime: string, name: string) => {
    if (mime.includes('image') || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name)) {
      return <ImageIcon className="h-4 w-4 text-emerald-500 shrink-0" />;
    }
    if (mime.includes('video') || /\.(mp4|mov|webm)$/i.test(name)) {
      return <Video className="h-4 w-4 text-purple-500 shrink-0" />;
    }
    if (mime.includes('audio') || /\.(mp3|wav|ogg)$/i.test(name)) {
      return <Music className="h-4 w-4 text-amber-500 shrink-0" />;
    }
    return <FileText className="h-4 w-4 text-slate-500 shrink-0" />;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Attach Existing Workspace File
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Select a file stored in Workspace → Files to reference it without duplicating storage.
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search workspace files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
          />
        </div>

        {/* File List */}
        <div className="mt-4 max-h-64 overflow-y-auto space-y-1.5 scrollbar-thin">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs font-semibold text-indigo-500 animate-pulse">
              Loading workspace files...
            </div>
          ) : files.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No workspace files found</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Upload files in Workspace → Files first.</p>
            </div>
          ) : (
            files.map((file) => {
              const isSelected = selectedFileIds.includes(file.id);
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    onSelectFile(file);
                    onClose();
                  }}
                  className={`flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {getIcon(file.mimeType, file.filename)}
                    <div className="truncate">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                        {file.filename}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Select
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

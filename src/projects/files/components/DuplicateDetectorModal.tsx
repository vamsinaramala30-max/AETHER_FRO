import React, { useState, useEffect } from 'react';
import { X, Copy, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DuplicateGroup } from '../types';
import { fileManagerApi } from '../fileManagerApi';
import { useNotificationStore } from '@/state/notificationStore';

interface DuplicateDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileTrashed: () => void;
}

export const DuplicateDetectorModal: React.FC<DuplicateDetectorModalProps> = ({
  isOpen,
  onClose,
  onFileTrashed,
}) => {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trashingId, setTrashingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fileManagerApi
        .getDuplicates()
        .then((data) => setDuplicates(data))
        .catch(() => setDuplicates([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleRemoveDuplicate = async (fileId: string, filename: string) => {
    setTrashingId(fileId);
    try {
      await fileManagerApi.moveToTrash(fileId);
      setDuplicates((prev) =>
        prev
          .map((group) => ({
            ...group,
            files: group.files.filter((f) => f.id !== fileId),
          }))
          .filter((group) => group.files.length > 1),
      );
      useNotificationStore.getState().addNotification({
        title: 'Duplicate Trashed',
        description: `"${filename}" moved to Trash.`,
        type: 'project',
      });
      onFileTrashed();
    } catch {
      useNotificationStore.getState().addNotification({
        title: 'Operation Failed',
        description: 'Failed to move duplicate file to trash.',
        type: 'project',
      });
    } finally {
      setTrashingId(null);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Duplicate File Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identify matching file contents to free storage space.
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
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-semibold text-slate-500">Scanning workspace files...</p>
            </div>
          ) : duplicates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="mb-2 h-10 w-10 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Duplicate Files Detected
              </h4>
              <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                All workspace files have unique content signatures. Storage is optimized.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-3 text-xs text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4" />
                  <span>{duplicates.length} duplicate clusters detected</span>
                </div>
                <p className="mt-1 text-[11px] opacity-90">
                  Review the files below. Removing unnecessary duplicate copies will recover
                  storage.
                </p>
              </div>

              {duplicates.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      Signature: {group.stem}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {formatSize(group.size)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.files.map((file, fIdx) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="truncate">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                            {file.filename}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Created {new Date(file.createdAt).toLocaleString()} •{' '}
                            {file.folder ? file.folder.name : 'Root'}
                          </p>
                        </div>

                        {fIdx > 0 ? (
                          <button
                            onClick={() => void handleRemoveDuplicate(file.id, file.filename)}
                            disabled={trashingId === file.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
                          >
                            {trashingId === file.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            <span>Trash Duplicate</span>
                          </button>
                        ) : (
                          <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                            Primary Copy
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

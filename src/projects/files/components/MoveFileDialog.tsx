import React, { useState } from 'react';
import { X, FolderInput, Folder, HardDrive, Loader2 } from 'lucide-react';
import { FolderItem, FileItem } from '../types';
import { fileManagerApi } from '../fileManagerApi';
import { useNotificationStore } from '@/state/notificationStore';

interface MoveFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetFiles: FileItem[];
  folders: FolderItem[];
  onMoved: () => void;
}

export const MoveFileDialog: React.FC<MoveFileDialogProps> = ({
  isOpen,
  onClose,
  targetFiles,
  folders,
  onMoved,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [moving, setMoving] = useState<boolean>(false);

  if (!isOpen || targetFiles.length === 0) return null;

  const handleConfirmMove = async () => {
    setMoving(true);
    try {
      for (const file of targetFiles) {
        await fileManagerApi.moveFile(file.id, selectedFolderId);
      }
      const targetName = selectedFolderId
        ? folders.find((f) => f.id === selectedFolderId)?.name || 'Folder'
        : 'Root (My Files)';

      useNotificationStore.getState().addNotification({
        title: 'Files Moved',
        description: `Moved ${targetFiles.length} item(s) to "${targetName}".`,
        type: 'project',
      });
      onMoved();
      onClose();
    } catch (err: any) {
      useNotificationStore.getState().addNotification({
        title: 'Move Failed',
        description: err?.message || 'Failed to move selected files.',
        type: 'project',
      });
    } finally {
      setMoving(false);
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <FolderInput className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Move {targetFiles.length === 1 ? `"${targetFiles[0].filename}"` : `${targetFiles.length} Items`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a target destination folder.
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

        {/* Folder Picker */}
        <div className="max-h-64 space-y-1 overflow-y-auto p-4">
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`flex w-full items-center gap-3 rounded-xl p-3 text-xs font-semibold transition-colors ${
              selectedFolderId === null
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <HardDrive className="h-4 w-4 shrink-0" />
            <span>Root (My Files)</span>
          </button>

          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Folder className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {folder.fileCount ?? 0} files
                </span>
              </button>
            );
          })}
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
            onClick={() => void handleConfirmMove()}
            disabled={moving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50"
          >
            {moving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            <span>Move Here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

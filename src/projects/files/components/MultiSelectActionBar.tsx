import React from 'react';
import { X, FolderInput, Star, Download, Trash2 } from 'lucide-react';

interface MultiSelectActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onMove: () => void;
  onFavorite: () => void;
  onDownload: () => void;
  onTrash: () => void;
  isTrashView?: boolean;
}

export const MultiSelectActionBar: React.FC<MultiSelectActionBarProps> = ({
  selectedCount,
  onClear,
  onMove,
  onFavorite,
  onDownload,
  onTrash,
  isTrashView = false,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/95 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold">
            {selectedCount}
          </span>
          <span className="font-semibold">Selected</span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isTrashView ? (
            <>
              <button
                onClick={onMove}
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <FolderInput className="h-3.5 w-3.5 text-blue-400" />
                <span>Move</span>
              </button>

              <button
                onClick={onFavorite}
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-semibold text-slate-300 hover:bg-slate-800 hover:text-amber-400"
              >
                <Star className="h-3.5 w-3.5" />
                <span>Favorite</span>
              </button>

              <button
                onClick={onDownload}
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-semibold text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={onTrash}
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Trash</span>
              </button>
            </>
          ) : (
            <button
              onClick={onTrash}
              className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Permanently</span>
            </button>
          )}
        </div>

        <button
          onClick={onClear}
          className="rounded-xl border-l border-slate-700 pl-3 text-slate-400 hover:text-white"
          title="Clear Selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

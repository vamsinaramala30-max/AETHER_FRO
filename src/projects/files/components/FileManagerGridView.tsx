import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
  Video,
  Music,
  Archive,
  MoreVertical,
  Star,
  Eye,
  Edit3,
  Sparkles,
  Download,
  Trash2,
  RotateCcw,
  Copy,
  FolderInput,
  Edit2,
  Info,
  CheckSquare,
  Square,
  BookOpen,
} from 'lucide-react';
import { FileItem, FolderItem } from '../types';
import { fileManagerApi } from '../fileManagerApi';

interface FileManagerGridViewProps {
  folders: FolderItem[];
  files: FileItem[];
  selectedIds: string[];
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onNavigateFolder: (folderId: string) => void;
  onPreview: (file: FileItem) => void;
  onEdit: (file: FileItem) => void;
  onAskAI: (file: FileItem) => void;
  onViewDetails: (file: FileItem) => void;
  onRenameFile: (file: FileItem) => void;
  onMoveFile: (file: FileItem) => void;
  onCopyFile: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onTrashFile: (file: FileItem) => void;
  onRestoreFile: (file: FileItem) => void;
  onPermanentDeleteFile: (file: FileItem) => void;
  onRenameFolder: (folder: FolderItem) => void;
  onDeleteFolder: (folder: FolderItem) => void;
  isTrashView?: boolean;
}

export const FileManagerGridView: React.FC<FileManagerGridViewProps> = ({
  folders,
  files,
  selectedIds,
  onToggleSelect,
  onNavigateFolder,
  onPreview,
  onEdit,
  onAskAI,
  onViewDetails,
  onRenameFile,
  onMoveFile,
  onCopyFile,
  onToggleFavorite,
  onTrashFile,
  onRestoreFile,
  onPermanentDeleteFile,
  onRenameFolder,
  onDeleteFolder,
  isTrashView = false,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isImage = (mime: string, name: string) =>
    mime.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  const isPdf = (mime: string, name: string) =>
    mime.includes('pdf') || /\.pdf$/i.test(name);
  const isSpreadsheet = (mime: string, name: string) =>
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime.includes('csv') ||
    /\.(xlsx|xls|csv)$/i.test(name);
  const isDocx = (mime: string, name: string) =>
    mime.includes('word') ||
    mime.includes('officedocument.wordprocessingml') ||
    /\.(docx|doc)$/i.test(name);
  const isPptx = (mime: string, name: string) =>
    mime.includes('presentation') ||
    mime.includes('powerpoint') ||
    /\.(pptx|ppt)$/i.test(name);
  const isVideo = (mime: string, name: string) =>
    mime.includes('video') || /\.(mp4|webm|mov|avi|mkv)$/i.test(name);
  const isAudio = (mime: string, name: string) =>
    mime.includes('audio') || /\.(mp3|wav|ogg|m4a)$/i.test(name);
  const isZip = (mime: string, name: string) =>
    mime.includes('zip') || mime.includes('compressed') || /\.(zip|tar|gz|7z|rar)$/i.test(name);
  const isCodeOrText = (mime: string, name: string) =>
    mime.includes('text') ||
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    /\.(txt|md|json|js|ts|tsx|jsx|html|css|py|yaml|yml|xml|env)$/i.test(name);

  const isEditable = (mime: string, name: string) =>
    isCodeOrText(mime, name) || isDocx(mime, name) || isSpreadsheet(mime, name);

  const renderFileThumbnail = (file: FileItem) => {
    if (isImage(file.mimeType, file.filename) && !isTrashView) {
      return (
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img
            src={fileManagerApi.getPreviewUrl(file.id)}
            alt={file.filename}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <ImageIcon className="absolute h-8 w-8 text-slate-400 opacity-20" />
        </div>
      );
    }

    let icon = <FileText className="h-10 w-10 text-slate-400" />;
    let bgStyle = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    let tag = 'FILE';

    if (isPdf(file.mimeType, file.filename)) {
      icon = <FileText className="h-10 w-10 text-rose-500" />;
      bgStyle = 'bg-rose-50 dark:bg-rose-950/30';
      tag = 'PDF';
    } else if (isDocx(file.mimeType, file.filename)) {
      icon = <FileText className="h-10 w-10 text-blue-600" />;
      bgStyle = 'bg-blue-50 dark:bg-blue-950/30';
      tag = 'DOCX';
    } else if (isSpreadsheet(file.mimeType, file.filename)) {
      icon = <FileSpreadsheet className="h-10 w-10 text-emerald-600" />;
      bgStyle = 'bg-emerald-50 dark:bg-emerald-950/30';
      tag = 'SHEET';
    } else if (isPptx(file.mimeType, file.filename)) {
      icon = <FileText className="h-10 w-10 text-amber-600" />;
      bgStyle = 'bg-amber-50 dark:bg-amber-950/30';
      tag = 'SLIDE';
    } else if (isVideo(file.mimeType, file.filename)) {
      icon = <Video className="h-10 w-10 text-purple-600" />;
      bgStyle = 'bg-purple-50 dark:bg-purple-950/30';
      tag = 'VIDEO';
    } else if (isAudio(file.mimeType, file.filename)) {
      icon = <Music className="h-10 w-10 text-amber-500" />;
      bgStyle = 'bg-amber-50 dark:bg-amber-950/30';
      tag = 'AUDIO';
    } else if (isZip(file.mimeType, file.filename)) {
      icon = <Archive className="h-10 w-10 text-indigo-600" />;
      bgStyle = 'bg-indigo-50 dark:bg-indigo-950/30';
      tag = 'ZIP';
    } else if (isCodeOrText(file.mimeType, file.filename)) {
      icon = <FileCode className="h-10 w-10 text-indigo-500" />;
      bgStyle = 'bg-indigo-50 dark:bg-indigo-950/30';
      const ext = file.filename.split('.').pop()?.toUpperCase() || 'CODE';
      tag = ext.slice(0, 4);
    }

    return (
      <div
        className={`relative flex h-32 w-full flex-col items-center justify-center rounded-xl transition-all ${bgStyle}`}
      >
        {icon}
        <span className="mt-2 rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-2xs backdrop-blur-xs dark:bg-slate-900/70 dark:text-slate-300">
          {tag}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Folders Section */}
      {!isTrashView && folders.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Folders ({folders.length})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onDoubleClick={() => onNavigateFolder(folder.id)}
                className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
              >
                <div
                  className="flex items-center gap-2.5 overflow-hidden"
                  onClick={() => onNavigateFolder(folder.id)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
                    <Folder className="h-5 w-5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                      {folder.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {folder.fileCount ?? 0} {folder.fileCount === 1 ? 'file' : 'files'}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === folder.id ? null : folder.id);
                    }}
                    className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 dark:hover:bg-slate-800"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {activeMenuId === folder.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                    >
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onNavigateFolder(folder.id);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Folder className="h-3.5 w-3.5 text-indigo-500" /> Open
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onRenameFolder(folder);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-amber-500" /> Rename
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onDeleteFolder(folder);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Files ({files.length})
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {files.map((file) => {
            const isSelected = selectedIds.includes(file.id);

            return (
              <div
                key={file.id}
                onDoubleClick={() => (isTrashView ? onViewDetails(file) : onPreview(file))}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400'
                    : 'border-slate-200/80 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                {/* Header inside Card: Selection checkbox & 3-dots */}
                <div className="mb-2.5 flex items-center justify-between">
                  <button
                    onClick={(e) => onToggleSelect(file.id, e)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300 opacity-60 group-hover:opacity-100 dark:text-slate-600" />
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Favorite star */}
                    {!isTrashView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(file);
                        }}
                        className={`rounded-lg p-1 transition-colors ${
                          file.isFavorite
                            ? 'text-amber-400 hover:text-amber-500'
                            : 'text-slate-300 opacity-0 hover:text-amber-400 group-hover:opacity-100 dark:text-slate-600'
                        }`}
                        title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star
                          className={`h-4 w-4 ${file.isFavorite ? 'fill-amber-400' : ''}`}
                        />
                      </button>
                    )}

                    {/* Context Menu trigger */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === file.id ? null : file.id);
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === file.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                        >
                          {!isTrashView ? (
                            <>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onPreview(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Eye className="h-3.5 w-3.5 text-indigo-500" /> Preview
                              </button>

                              {isEditable(file.mimeType, file.filename) && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onEdit(file);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                  <Edit3 className="h-3.5 w-3.5 text-emerald-500" /> Edit in AETHER
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onAskAI(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Ask AETHER (AI)
                              </button>

                              <a
                                href={fileManagerApi.getDownloadUrl(file.id)}
                                download={file.filename}
                                onClick={() => setActiveMenuId(null)}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Download className="h-3.5 w-3.5 text-emerald-600" /> Download
                              </a>

                              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onRenameFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Edit2 className="h-3.5 w-3.5 text-amber-500" /> Rename
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onMoveFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <FolderInput className="h-3.5 w-3.5 text-blue-500" /> Move to Folder
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onCopyFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Copy className="h-3.5 w-3.5 text-slate-500" /> Duplicate
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewDetails(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Info className="h-3.5 w-3.5 text-indigo-400" /> Details & History
                              </button>

                              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onTrashFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Move to Trash
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onRestoreFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                              >
                                <RotateCcw className="h-3.5 w-3.5" /> Restore
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onPermanentDeleteFile(file);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div
                  className="cursor-pointer"
                  onClick={() => (isTrashView ? onViewDetails(file) : onPreview(file))}
                >
                  {renderFileThumbnail(file)}
                </div>

                {/* File info */}
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      title={file.filename}
                      className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
                    >
                      {file.filename}
                    </p>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{formatSize(file.size)}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Badges footer */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {file.isKnowledge && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                        <BookOpen className="h-2.5 w-2.5" /> Knowledge
                      </span>
                    )}
                    {file.versionCount !== undefined && file.versionCount > 1 && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        v{file.versionCount}
                      </span>
                    )}
                    {file.folder && (
                      <span className="truncate rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                        {file.folder.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

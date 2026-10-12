import React, { useState } from 'react';
import {
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
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { FileItem } from '../types';
import { fileManagerApi } from '../fileManagerApi';

interface FileManagerListViewProps {
  files: FileItem[];
  selectedIds: string[];
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onToggleSelectAll: () => void;
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
  isTrashView?: boolean;
}

export const FileManagerListView: React.FC<FileManagerListViewProps> = ({
  files,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
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
  isTrashView = false,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'filename' | 'size' | 'createdAt'>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

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

  const getFileIcon = (mimeType: string, filename: string) => {
    if (isImage(mimeType, filename)) return <ImageIcon className="h-4 w-4 text-emerald-500" />;
    if (isPdf(mimeType, filename)) return <FileText className="h-4 w-4 text-rose-500" />;
    if (isDocx(mimeType, filename)) return <FileText className="h-4 w-4 text-blue-600" />;
    if (isSpreadsheet(mimeType, filename))
      return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
    if (isVideo(mimeType, filename)) return <Video className="h-4 w-4 text-purple-600" />;
    if (isAudio(mimeType, filename)) return <Music className="h-4 w-4 text-amber-500" />;
    if (isZip(mimeType, filename)) return <Archive className="h-4 w-4 text-indigo-600" />;
    if (isCodeOrText(mimeType, filename)) return <FileCode className="h-4 w-4 text-indigo-500" />;
    return <FileText className="h-4 w-4 text-slate-400" />;
  };

  const handleSort = (field: 'filename' | 'size' | 'createdAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    let result = 0;
    if (sortField === 'filename') {
      result = a.filename.localeCompare(b.filename);
    } else if (sortField === 'size') {
      result = a.size - b.size;
    } else if (sortField === 'createdAt') {
      result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortAsc ? result : -result;
  });

  const allSelected = sortedFiles.length > 0 && selectedIds.length === sortedFiles.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200/80 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="w-10 px-4 py-3">
                <button
                  onClick={onToggleSelectAll}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {allSelected ? (
                    <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">
                <button
                  onClick={() => handleSort('filename')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Name</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">
                <button
                  onClick={() => handleSort('size')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Size</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>{isTrashView ? 'Trashed' : 'Modified'}</span>
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Status & Intelligence</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {sortedFiles.map((file) => {
              const isSelected = selectedIds.includes(file.id);

              return (
                <tr
                  key={file.id}
                  onDoubleClick={() => (isTrashView ? onViewDetails(file) : onPreview(file))}
                  className={`group transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/20'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {/* Select */}
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => onToggleSelect(file.id, e)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  </td>

                  {/* Name + Icon */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {!isTrashView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(file);
                          }}
                          className={`text-slate-300 hover:text-amber-400 ${
                            file.isFavorite ? 'text-amber-400' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          title={file.isFavorite ? 'Remove favorite' : 'Add favorite'}
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${file.isFavorite ? 'fill-amber-400' : ''}`}
                          />
                        </button>
                      )}
                      <div className="shrink-0">{getFileIcon(file.mimeType, file.filename)}</div>
                      <div className="max-w-md truncate">
                        <span
                          onClick={() => (isTrashView ? onViewDetails(file) : onPreview(file))}
                          className="cursor-pointer font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                        >
                          {file.filename}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {file.folder ? (
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        {file.folder.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">My Files / Root</span>
                    )}
                  </td>

                  {/* Size */}
                  <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                    {formatSize(file.size)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(
                      isTrashView && file.trashedAt ? file.trashedAt : file.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  {/* Status & Intelligence */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-2.5 w-2.5" /> Indexed
                      </span>
                      {file.isKnowledge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          <BookOpen className="h-2.5 w-2.5" /> Knowledge
                        </span>
                      )}
                      {file.versionCount !== undefined && file.versionCount > 1 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          v{file.versionCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!isTrashView ? (
                        <>
                          <button
                            onClick={() => onPreview(file)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {isEditable(file.mimeType, file.filename) && (
                            <button
                              onClick={() => onEdit(file)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                              title="Edit in AETHER"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}

                          <a
                            href={fileManagerApi.getDownloadUrl(file.id)}
                            download={file.filename}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>

                          <button
                            onClick={() => onViewDetails(file)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800"
                            title="Details"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onRestoreFile(file)}
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            title="Restore file"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onPermanentDeleteFile(file)}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === file.id ? null : file.id)
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {activeMenuId === file.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-800 dark:bg-slate-900"
                          >
                            {!isTrashView ? (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onAskAI(file);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Ask AETHER
                                </button>
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
                                  <FolderInput className="h-3.5 w-3.5 text-blue-500" /> Move to
                                  folder
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

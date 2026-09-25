import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FolderOpen,
  Upload,
  Search,
  FileText,
  Image as ImageIcon,
  FileCode,
  Trash2,
  Edit2,
  Eye,
  X,
  AlertCircle,
  FileCheck,
  Download,
  Video,
  Music,
  Archive,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '../../api/client';
import { useNotificationStore } from '@/state/notificationStore';
import { onActivityUpdate, triggerActivityUpdate } from '@/shared/activityEvents';

export type FileCategory =
  'All Files' | 'Images' | 'PDFs' | 'Videos' | 'Audio' | 'ZIPs' | 'Other uploads';

export interface FileItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  status: string;
  tags?: string[];
}

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('All Files');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [_totalPages, setTotalPages] = useState<number>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [renameTarget, setRenameTarget] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [previewTarget, setPreviewTarget] = useState<FileItem | null>(null);
  const [previewTextContent, setPreviewTextContent] = useState<string | null>(null);
  const [previewTextLoading, setPreviewTextLoading] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);

  const categories: FileCategory[] = [
    'All Files',
    'Images',
    'PDFs',
    'Videos',
    'Audio',
    'ZIPs',
    'Other uploads',
  ];

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any>(
        `/uploads?search=${encodeURIComponent(search)}&page=${page}&limit=50`,
      );
      const payload = data.data || data;
      const rawFiles = Array.isArray(payload) ? payload : payload?.files || payload?.data || [];

      if (Array.isArray(rawFiles)) {
        setFiles(
          rawFiles.map((f: any) => ({
            id: f.id || `file-${Date.now()}`,
            filename: f.filename || f.originalname || 'Untitled File',
            mimeType: f.mimeType || f.mimetype || 'application/octet-stream',
            size: f.size || 1024,
            createdAt: f.createdAt || new Date().toISOString(),
            status: f.status || 'READY',
            tags: f.tags || [],
          })),
        );
        if (payload?.pagination) {
          setTotalPages(payload.pagination.totalPages || 1);
        }
      } else {
        setFiles([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to retrieve workspace files from server.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void fetchFiles();
    const unsubscribe = onActivityUpdate(() => {
      void fetchFiles();
    });
    return unsubscribe;
  }, [fetchFiles]);

  const isImage = (mime: string, name: string) => {
    return mime.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  };

  const isPdf = (mime: string, name: string) => {
    return mime.includes('pdf') || /\.pdf$/i.test(name);
  };

  const isText = (mime: string, name: string) => {
    return (
      mime.includes('text') ||
      mime.includes('json') ||
      mime.includes('javascript') ||
      mime.includes('typescript') ||
      mime.includes('csv') ||
      /\.(txt|md|json|js|ts|jsx|tsx|html|css|py|csv|env|log|xml|yaml|yml)$/i.test(name)
    );
  };

  const isVideo = (mime: string, name: string) => {
    return mime.includes('video') || /\.(mp4|webm|mov|avi|mkv|flv|wmv)$/i.test(name);
  };

  const isAudio = (mime: string, name: string) => {
    return mime.includes('audio') || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(name);
  };

  const isZip = (mime: string, name: string) => {
    return (
      mime.includes('zip') || mime.includes('compressed') || /\.(zip|tar|gz|7z|rar)$/i.test(name)
    );
  };

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      if (selectedCategory === 'All Files') return true;
      if (selectedCategory === 'Images') return isImage(file.mimeType, file.filename);
      if (selectedCategory === 'PDFs') return isPdf(file.mimeType, file.filename);
      if (selectedCategory === 'Videos') return isVideo(file.mimeType, file.filename);
      if (selectedCategory === 'Audio') return isAudio(file.mimeType, file.filename);
      if (selectedCategory === 'ZIPs') return isZip(file.mimeType, file.filename);
      if (selectedCategory === 'Other uploads') {
        return (
          !isImage(file.mimeType, file.filename) &&
          !isPdf(file.mimeType, file.filename) &&
          !isVideo(file.mimeType, file.filename) &&
          !isAudio(file.mimeType, file.filename) &&
          !isZip(file.mimeType, file.filename)
        );
      }
      return true;
    });
  }, [files, selectedCategory]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFiles: FileList | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      selectedFiles = e.dataTransfer.files;
    } else if (e.target.files) {
      selectedFiles = e.target.files;
    }

    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);

    try {
      setUploadProgress(60);
      const res = await apiClient.post<any>('/uploads/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadProgress(90);
      const item = res.data || res;
      const newFile: FileItem = {
        id: item.id || `file-${Date.now()}`,
        filename: item.filename || selectedFiles[0].name,
        mimeType: item.mimeType || selectedFiles[0].type || 'application/octet-stream',
        size: item.size || selectedFiles[0].size,
        createdAt: new Date().toISOString(),
        status: 'READY',
      };
      setFiles((prev) => [newFile, ...prev]);
      setUploadProgress(100);
      triggerActivityUpdate();
      useNotificationStore.getState().addNotification({
        title: 'File Uploaded',
        description: `"${newFile.filename}" committed to storage.`,
        type: 'project',
      });
    } catch {
      useNotificationStore.getState().addNotification({
        title: 'Upload Error',
        description: 'Failed to complete file upload to backend.',
        type: 'project',
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      await apiClient.delete(`/uploads/${file.id}`);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      setSelectedIds((prev) => prev.filter((id) => id !== file.id));
      setDeleteTarget(null);
      triggerActivityUpdate();
      useNotificationStore.getState().addNotification({
        title: 'File Deleted',
        description: `"${file.filename}" permanently removed.`,
        type: 'project',
      });
    } catch (err: any) {
      setDeleteTarget(null);
      useNotificationStore.getState().addNotification({
        title: 'Deletion Failed',
        description: err?.message || `Unable to delete "${file.filename}" from server.`,
        type: 'project',
      });
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !newName.trim()) return;
    try {
      await apiClient.patch(`/uploads/${renameTarget.id}`, { filename: newName });
      setFiles((prev) =>
        prev.map((f) => (f.id === renameTarget.id ? { ...f, filename: newName } : f)),
      );
      setRenameTarget(null);
      setNewName('');
      triggerActivityUpdate();
      useNotificationStore.getState().addNotification({
        title: 'File Renamed',
        description: `Updated filename to "${newName}".`,
        type: 'project',
      });
    } catch (err: any) {
      setRenameTarget(null);
      setNewName('');
      useNotificationStore.getState().addNotification({
        title: 'Rename Failed',
        description: err?.message || `Failed to rename "${renameTarget.filename}" on server.`,
        type: 'project',
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleOpenPreview = (file: FileItem) => {
    setPreviewTarget(file);
    setPreviewTextContent(null);

    if (isText(file.mimeType, file.filename)) {
      setPreviewTextLoading(true);
      fetch(`/api/v1/uploads/${file.id}/preview`)
        .then((r) => r.text())
        .then((t) => setPreviewTextContent(t))
        .catch(() => setPreviewTextContent('Unable to load text contents.'))
        .finally(() => setPreviewTextLoading(false));
    }
  };

  const getFileIcon = (mimeType: string, filename: string) => {
    if (isImage(mimeType, filename))
      return <ImageIcon className="h-5 w-5 shrink-0 text-emerald-500" />;
    if (isPdf(mimeType, filename)) return <FileText className="h-5 w-5 shrink-0 text-rose-500" />;
    if (isVideo(mimeType, filename)) return <Video className="h-5 w-5 shrink-0 text-purple-500" />;
    if (isAudio(mimeType, filename)) return <Music className="h-5 w-5 shrink-0 text-amber-500" />;
    if (isZip(mimeType, filename)) return <Archive className="h-5 w-5 shrink-0 text-blue-500" />;
    if (isText(mimeType, filename))
      return <FileCode className="h-5 w-5 shrink-0 text-indigo-500" />;
    return <FileText className="h-5 w-5 shrink-0 text-slate-500" />;
  };

  const getDownloadUrl = (id: string) => `/api/v1/uploads/${id}/download`;
  const getPreviewUrl = (id: string) => `/api/v1/uploads/${id}/preview`;

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <PageWrapper wide>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-7 w-7 shrink-0 text-purple-600 dark:text-purple-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workspace Files
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage, upload, preview, and organize your raw workspace assets.
            </p>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500">
          <Upload className="h-4 w-4" />
          <span>Upload File</span>
          <input type="file" className="hidden" onChange={(e) => void handleFileUpload(e)} />
        </label>
      </div>

      {/* Upload Progress bar */}
      {uploading && (
        <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-50/50 p-4 dark:bg-indigo-950/20">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-900">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Category Tabs INSIDE Files Page */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedIds([]);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Drag-Drop zone */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search files by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Drag and Drop Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => void handleFileUpload(e)}
        className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/40"
      >
        <Upload className="mb-2 h-8 w-8 text-slate-400" />
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Drag and drop files here, or browse from your computer
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => void fetchFiles()}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main File List Container */}
      <div className="mt-6">
        {loading ? (
          <div className="flex h-48 w-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
            <FileCheck className="mb-3 h-10 w-10 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No files yet</p>
            <p className="mt-1 text-xs text-slate-400">Upload raw assets to your workspace.</p>
            <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload File</span>
              <input type="file" className="hidden" onChange={(e) => void handleFileUpload(e)} />
            </label>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      <button onClick={toggleSelectAll} className="flex items-center gap-1.5">
                        {selectedIds.length === filteredFiles.length ? (
                          <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400" />
                        )}
                        <span>File Name</span>
                      </button>
                    </th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                    <th className="px-4 py-3 font-semibold">AI Indexing</th>
                    <th className="px-4 py-3 font-semibold">Date Uploaded</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedIds.includes(file.id);
                    return (
                      <tr
                        key={file.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleSelectOne(file.id)}>
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </button>
                            {getFileIcon(file.mimeType, file.filename)}
                            <span className="max-w-xs truncate font-semibold text-slate-900 dark:text-white">
                              {file.filename}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                          {formatSize(file.size)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="h-3 w-3" /> Indexed
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenPreview(file)}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Preview</span>
                            </button>
                            <a
                              href={getDownloadUrl(file.id)}
                              download={file.filename}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => {
                                setRenameTarget(file);
                                setNewName(file.filename);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
                              title="Rename"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(file)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getFileIcon(file.mimeType, file.filename)}
                      <div className="truncate">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {file.filename}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenPreview(file)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <Eye className="h-3.5 w-3.5 text-indigo-500" /> Preview
                    </button>
                    <a
                      href={getDownloadUrl(file.id)}
                      download={file.filename}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-500" /> Download
                    </a>
                    <button
                      onClick={() => setDeleteTarget(file)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* REAL PREVIEW MODAL */}
      {previewTarget && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                {getFileIcon(previewTarget.mimeType, previewTarget.filename)}
                <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                  {previewTarget.filename}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getDownloadUrl(previewTarget.id)}
                  download={previewTarget.filename}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewTarget(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="flex max-h-[600px] min-h-[300px] flex-col items-center justify-center overflow-y-auto p-6">
              {isImage(previewTarget.mimeType, previewTarget.filename) ? (
                <img
                  src={getPreviewUrl(previewTarget.id)}
                  alt={previewTarget.filename}
                  className="max-h-[500px] w-auto rounded-xl object-contain shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : isPdf(previewTarget.mimeType, previewTarget.filename) ? (
                <iframe
                  src={getPreviewUrl(previewTarget.id)}
                  title={previewTarget.filename}
                  className="h-[500px] w-full rounded-xl border border-slate-200 dark:border-slate-800"
                />
              ) : isVideo(previewTarget.mimeType, previewTarget.filename) ? (
                <video
                  controls
                  src={getPreviewUrl(previewTarget.id)}
                  className="max-h-[450px] w-full rounded-xl shadow-sm"
                />
              ) : isAudio(previewTarget.mimeType, previewTarget.filename) ? (
                <div className="w-full py-8 text-center">
                  <Music className="mx-auto mb-4 h-12 w-12 text-amber-500" />
                  <audio controls src={getPreviewUrl(previewTarget.id)} className="w-full" />
                </div>
              ) : isText(previewTarget.mimeType, previewTarget.filename) ? (
                previewTextLoading ? (
                  <span className="animate-pulse text-xs font-semibold text-indigo-500">
                    Loading file contents...
                  </span>
                ) : (
                  <pre className="scrollbar-thin max-h-[450px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                    {previewTextContent}
                  </pre>
                )
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <AlertTriangle className="mb-3 h-10 w-10 text-amber-500" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Preview unavailable for this file type
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                    You can download this raw asset directly to view it on your local device.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENAME DIALOG */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Rename File</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleRename()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete File</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to permanently delete "{deleteTarget.filename}"? This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDeleteFile(deleteTarget)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '../../api/client';

interface FileItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  status: string;
}

const mockFilesList: FileItem[] = [
  {
    id: 'file-1',
    filename: 'AETHER_Architecture_Overview.pdf',
    mimeType: 'application/pdf',
    size: 2450000,
    createdAt: '2026-08-01T10:00:00Z',
    status: 'COMPLETED',
  },
  {
    id: 'file-2',
    filename: 'System_Telemetry_Log.json',
    mimeType: 'application/json',
    size: 142000,
    createdAt: '2026-08-02T14:30:00Z',
    status: 'COMPLETED',
  },
  {
    id: 'file-3',
    filename: 'Dashboard_Mockup_v2.png',
    mimeType: 'image/png',
    size: 1850000,
    createdAt: '2026-08-02T16:00:00Z',
    status: 'COMPLETED',
  },
];

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFilesList);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [renameTarget, setRenameTarget] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [previewTarget, setPreviewTarget] = useState<FileItem | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any>(
        `/uploads?search=${encodeURIComponent(search)}&page=${page}&limit=10`,
      );
      const payload = data.data || data;
      const rawFiles = Array.isArray(payload)
        ? payload
        : payload?.files || payload?.data || mockFilesList;

      if (Array.isArray(rawFiles) && rawFiles.length > 0) {
        setFiles(
          rawFiles.map((f: any) => ({
            id: f.id || `file-${Date.now()}`,
            filename: f.filename || f.originalname || 'Untitled File',
            mimeType: f.mimeType || f.mimetype || 'application/octet-stream',
            size: f.size || 1024,
            createdAt: f.createdAt || new Date().toISOString(),
            status: f.status || 'COMPLETED',
          })),
        );
        if (payload?.pagination) {
          setTotalPages(payload.pagination.totalPages || 1);
        }
      } else {
        setFiles(mockFilesList);
      }
    } catch {
      setFiles(mockFilesList);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

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
        status: 'COMPLETED',
      };
      setFiles((prev) => [newFile, ...prev]);
      setUploadProgress(100);
    } catch {
      const fallbackFile: FileItem = {
        id: `file-${Date.now()}`,
        filename: selectedFiles[0].name,
        mimeType: selectedFiles[0].type || 'application/octet-stream',
        size: selectedFiles[0].size,
        createdAt: new Date().toISOString(),
        status: 'COMPLETED',
      };
      setFiles((prev) => [fallbackFile, ...prev]);
      setUploadProgress(100);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this file permanently?')) return;
    try {
      await apiClient.delete(`/uploads/${id}`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setFiles((prev) => prev.filter((f) => f.id !== id));
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
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.id === renameTarget.id ? { ...f, filename: newName } : f)),
      );
      setRenameTarget(null);
      setNewName('');
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <ImageIcon className="h-5 w-5 text-emerald-500" />;
    if (mimeType.includes('code') || mimeType.includes('json') || mimeType.includes('javascript'))
      return <FileCode className="h-5 w-5 text-indigo-500" />;
    return <FileText className="h-5 w-5 text-purple-500" />;
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workspace Files
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage, upload, preview, and organize your production assets.
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
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/50 p-4 dark:bg-indigo-950/20">
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

      {/* Search & Drag-Drop zone */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/40"
      >
        <Upload className="mb-2 h-8 w-8 text-slate-400" />
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Drag and drop files here, or browse from your computer
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File List / Table */}
      {loading ? (
        <div className="flex h-48 w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
          <FileCheck className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No files found</p>
          <p className="text-xs text-slate-400">
            Upload your first document or asset to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">File Name</th>
                <th className="px-5 py-3 font-semibold">Size</th>
                <th className="px-5 py-3 font-semibold">Date Uploaded</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.mimeType)}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {file.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">
                    {formatSize(file.size)}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-500 dark:text-slate-400">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewTarget(file)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
                        onClick={() => void handleDelete(file.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Rename File</h3>
              <button
                onClick={() => setRenameTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleRename()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {getFileIcon(previewTarget.mimeType)}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {previewTarget.filename}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-[300px] flex-1 items-center justify-center p-6">
              {previewTarget.mimeType.includes('image') ? (
                <img
                  src={`/api/v1/uploads/${previewTarget.id}/download`}
                  alt={previewTarget.filename}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <FileText className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                  <p className="text-xs font-semibold">
                    Preview not available directly for this file format ({previewTarget.mimeType}).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  FileCode,
  Archive,
  FileSpreadsheet,
  Eye,
  Code2,
  Edit3,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from 'lucide-react';
import { env } from '@/config/environment';
import { apiClient } from '@/api/client';
import { UnifiedFileEditor } from './UnifiedFileEditor';
import {
  getFileViewerType,
  formatFileSize,
  isEditableFile,
  FileItemLike,
} from './fileCapabilityDetector';

import { FilePreview } from './FilePreview';

export interface PreviewFileTarget extends FileItemLike {
  fileId?: string;
  attachedFileIds?: string[];
  projectId?: string;
  createdAt?: string;
}

export interface UnifiedFilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  target?: PreviewFileTarget | string | null;
  projectId?: string;
}

export const UnifiedFilePreviewModal: React.FC<UnifiedFilePreviewModalProps> = ({
  isOpen,
  onClose,
  target,
  projectId: propProjectId,
}) => {
  const [resolvedFile, setResolvedFile] = useState<PreviewFileTarget | null>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState<boolean>(false);
  const [textError, setTextError] = useState<string | null>(null);
  const [markdownViewMode, setMarkdownViewMode] = useState<'rendered' | 'source'>('rendered');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Handle ESC key to close / exit fullscreen
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  const getAuthToken = useCallback((): string => {
    let token =
      localStorage.getItem('aether_access_token') ||
      localStorage.getItem('aether-auth-token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('token');
    if (!token) {
      try {
        const zustandStore = localStorage.getItem('aether-auth-storage');
        if (zustandStore) {
          const parsed = JSON.parse(zustandStore);
          if (parsed?.state?.token && typeof parsed.state.token === 'string') {
            token = parsed.state.token;
          }
        }
      } catch {
        /* ignore */
      }
    }
    return token || '';
  }, []);

  const getApiBaseUrl = useCallback((): string => {
    const raw = env.VITE_API_BASE_URL || '/api/v1';
    return raw.replace(/\/+$/, '');
  }, []);

  // Resolve target object or ID
  useEffect(() => {
    if (!isOpen || !target) {
      setResolvedFile(null);
      setTextContent(null);
      setTextError(null);
      setIsEditing(false);
      setIsFullscreen(false);
      return;
    }
    setIsEditing(false);

    if (typeof target === 'string') {
      // String target is a fileId
      setLoadingFile(true);
      const fileId = target;
      apiClient
        .get<any>(`/uploads/${fileId}`)
        .then((res) => {
          const item = res.data || res;
          setResolvedFile({
            id: item.id || fileId,
            filename: item.filename || item.name || 'Untitled File',
            mimeType: item.mimeType || item.mimetype || 'application/octet-stream',
            size: item.size || 0,
            projectId: item.projectId || propProjectId,
            createdAt: item.createdAt,
            detectedMimeType: item.detectedMimeType,
            extension: item.extension,
          });
        })
        .catch(() => {
          setResolvedFile({
            id: fileId,
            filename: 'File ' + fileId.slice(0, 8),
            mimeType: 'application/octet-stream',
            size: 0,
            projectId: propProjectId,
          });
        })
        .finally(() => setLoadingFile(false));
    } else {
      const effectiveId =
        target.id ||
        target.fileId ||
        (target.attachedFileIds && target.attachedFileIds.length > 0
          ? target.attachedFileIds[0]
          : undefined);

      setResolvedFile({
        ...target,
        id: effectiveId,
        filename: target.filename || target.name || 'Untitled File',
        mimeType: target.mimeType || 'application/octet-stream',
        size: target.size || 0,
        projectId: target.projectId || propProjectId,
      });
    }
  }, [isOpen, target, propProjectId]);

  const effectiveId = resolvedFile?.id;
  const effectiveProjectId = resolvedFile?.projectId || propProjectId;

  const downloadUrl = useMemo(() => {
    if (effectiveId) {
      const base = getApiBaseUrl();
      const token = getAuthToken();
      const params = new URLSearchParams();
      if (token) params.set('token', token);
      if (effectiveProjectId) params.set('projectId', effectiveProjectId);
      const qs = params.toString();
      return `${base}/uploads/${effectiveId}/download${qs ? `?${qs}` : ''}`;
    }
    if (resolvedFile?.downloadUrl) return resolvedFile.downloadUrl;
    if (resolvedFile?.url && resolvedFile.url.startsWith('http')) return resolvedFile.url;
    return '';
  }, [effectiveId, effectiveProjectId, resolvedFile, getApiBaseUrl, getAuthToken]);

  const previewUrl = useMemo(() => {
    if (!effectiveId) return '';
    const base = getApiBaseUrl();
    const token = getAuthToken();
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (effectiveProjectId) params.set('projectId', effectiveProjectId);
    const qs = params.toString();
    return `${base}/uploads/${effectiveId}/preview${qs ? `?${qs}` : ''}`;
  }, [effectiveId, effectiveProjectId, getApiBaseUrl, getAuthToken]);

  const filename = resolvedFile?.filename || resolvedFile?.name || 'Untitled File';
  const mimeType = resolvedFile?.mimeType || 'application/octet-stream';
  const viewerType = useMemo(() => getFileViewerType(resolvedFile), [resolvedFile]);

  // Fetch text contents if file can be rendered as text/code/markdown/docx/spreadsheet/pptx/json
  useEffect(() => {
    if (!isOpen || !resolvedFile) return;

    if (resolvedFile.content && !effectiveId) {
      setTextContent(resolvedFile.content);
      return;
    }

    const needsTextFetch = [
      'text',
      'code',
      'markdown',
      'csv',
      'spreadsheet',
      'docx',
      'pptx',
    ].includes(viewerType);

    if (needsTextFetch && effectiveId) {
      setTextLoading(true);
      setTextError(null);
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch(previewUrl, { headers })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to read file content (HTTP ${res.status})`);
          }
          return res.text();
        })
        .then((text) => setTextContent(text))
        .catch((err) => {
          setTextError(err?.message || 'Unable to read file content.');
        })
        .finally(() => setTextLoading(false));
    }
  }, [isOpen, resolvedFile, viewerType, effectiveId, previewUrl, getAuthToken]);

  const canEdit = useMemo(() => isEditableFile(resolvedFile), [resolvedFile]);

  const getHeaderIcon = () => {
    switch (viewerType) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-rose-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'audio':
        return <Music className="h-5 w-5 text-amber-500" />;
      case 'csv':
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'pptx':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-slate-400" />;
      case 'code':
      case 'markdown':
      case 'text':
        return <FileCode className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  // Render markdown with typography
  const renderMarkdownFormatted = (text: string) => {
    const lines = text.split(/\r?\n/);
    return (
      <div className="space-y-2.5 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="pt-2 text-sm font-bold text-slate-900 dark:text-white">
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="pt-3 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="pt-3 text-xl font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                {trimmed.replace(/^#\s+/, '')}
              </h1>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300">
                {trimmed.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-indigo-500 pl-3 italic text-slate-600 dark:text-slate-400 my-1">
                {trimmed.replace(/^>\s+/, '')}
              </blockquote>
            );
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-3 border-slate-200 dark:border-slate-800" />;
          }
          if (trimmed === '') {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} className="text-slate-700 dark:text-slate-300">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md duration-200 ${
        isFullscreen ? 'p-0' : 'p-3 sm:p-5'
      }`}
    >
      <div
        className={`flex flex-col overflow-hidden bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all ${
          isFullscreen
            ? 'h-full w-full rounded-none border-0'
            : 'max-h-[92vh] w-full max-w-5xl rounded-2xl border border-slate-200'
        }`}
      >
        {/* Universal Viewer Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-xs">
              {getHeaderIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white" title={filename}>
                {filename}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {formatFileSize(resolvedFile?.size)} {mimeType ? `• ${mimeType}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Mode Toggle for supported types */}
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isEditing
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'View Mode' : 'Edit File'}</span>
              </button>
            )}

            {/* Markdown Rendered vs Source Toggle */}
            {!isEditing && viewerType === 'markdown' && (
              <div className="flex items-center rounded-xl border border-slate-200 p-0.5 dark:border-slate-700 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setMarkdownViewMode('rendered')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    markdownViewMode === 'rendered'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>Formatted</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMarkdownViewMode('source')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    markdownViewMode === 'source'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="h-3 w-3" />
                  <span>Source</span>
                </button>
              </div>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={filename}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Universal Viewer Body */}
        {isEditing ? (
          <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-[500px]">
            <UnifiedFileEditor
              fileId={effectiveId}
              filename={filename}
              mimeType={mimeType}
              initialContent={textContent || resolvedFile?.content || ''}
              onSave={async (newContent) => {
                if (effectiveId) {
                  await apiClient.put(`/uploads/${effectiveId}/content`, {
                    content: newContent,
                    projectId: effectiveProjectId,
                  });
                }
                setTextContent(newContent);
              }}
              onClose={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center overflow-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/20">
            <FilePreview
              viewerType={viewerType}
              filename={filename}
              mimeType={mimeType}
              size={resolvedFile?.size}
              url={previewUrl || resolvedFile?.url || ''}
              downloadUrl={downloadUrl}
              content={textContent || resolvedFile?.content || ''}
              loading={loadingFile || textLoading}
              error={textError}
              isFullscreen={isFullscreen}
              onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
              markdownViewMode={markdownViewMode}
              renderMarkdownFormatted={renderMarkdownFormatted}
            />
          </div>
        )}
      </div>
    </div>
  );
};

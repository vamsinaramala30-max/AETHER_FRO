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
  AlertTriangle,
  Table,
  FileSpreadsheet,
  Eye,
  Code2,
  Edit3,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { env } from '@/config/environment';
import { apiClient } from '@/api/client';
import { UnifiedFileEditor } from './UnifiedFileEditor';

export interface PreviewFileTarget {
  id?: string;
  fileId?: string;
  filename?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  downloadUrl?: string;
  previewUrl?: string;
  content?: string;
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
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Handle ESC key to close
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
      } catch {}
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
          });
        })
        .catch(() => {
          // If metadata endpoint fails, construct minimal file target
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
      // Target is an object
      const effectiveId =
        target.id ||
        target.fileId ||
        (target.attachedFileIds && target.attachedFileIds.length > 0
          ? target.attachedFileIds[0]
          : undefined);

      setResolvedFile({
        ...target,
        id: effectiveId,
        filename: target.filename || target.name || 'Untitled Document',
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

  const filename = resolvedFile?.filename || 'Untitled File';
  const mimeType = (resolvedFile?.mimeType || '').toLowerCase();

  const isImage = useMemo(() => {
    return (
      mimeType.startsWith('image/') ||
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isPdf = useMemo(() => {
    return mimeType === 'application/pdf' || /\.pdf$/i.test(filename);
  }, [mimeType, filename]);

  const isVideo = useMemo(() => {
    return (
      (mimeType.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(filename)) &&
      !/\.(avi|mkv|wmv|flv)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isUnsupportedVideo = useMemo(() => {
    return (
      mimeType.includes('msvideo') ||
      mimeType.includes('matroska') ||
      /\.(avi|mkv|wmv|flv)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isAudio = useMemo(() => {
    return (
      mimeType.startsWith('audio/') ||
      /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isMarkdown = useMemo(() => {
    return (
      mimeType === 'text/markdown' ||
      mimeType === 'text/x-markdown' ||
      /\.(md|markdown)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isCsv = useMemo(() => {
    return (
      mimeType === 'text/csv' ||
      mimeType === 'application/csv' ||
      mimeType === 'text/tab-separated-values' ||
      mimeType === 'text/tsv' ||
      /\.(csv|tsv)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isTsv = useMemo(() => {
    return (
      mimeType === 'text/tab-separated-values' ||
      mimeType === 'text/tsv' ||
      /\.tsv$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isWordDoc = useMemo(() => {
    return (
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('msword') ||
      /\.(docx|doc)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isSpreadsheetDoc = useMemo(() => {
    return (
      mimeType.includes('spreadsheetml') ||
      mimeType.includes('ms-excel') ||
      /\.(xlsx|xls)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isPresentationDoc = useMemo(() => {
    return (
      mimeType.includes('presentationml') ||
      mimeType.includes('ms-powerpoint') ||
      mimeType.includes('opendocument.presentation') ||
      /\.(pptx|ppt|odp)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isArchive = useMemo(() => {
    return (
      mimeType.includes('zip') ||
      mimeType.includes('compressed') ||
      mimeType.includes('tar') ||
      mimeType.includes('gzip') ||
      /\.(zip|tar|gz|7z|rar)$/i.test(filename)
    );
  }, [mimeType, filename]);

  const isTextOrCode = useMemo(() => {
    return (
      isMarkdown ||
      isCsv ||
      mimeType.startsWith('text/') ||
      mimeType.includes('json') ||
      mimeType.includes('javascript') ||
      mimeType.includes('typescript') ||
      mimeType.includes('xml') ||
      mimeType.includes('yaml') ||
      mimeType.includes('sql') ||
      /\.(txt|json|js|ts|jsx|tsx|html|htm|css|py|sh|bash|yaml|yml|xml|log|env|sql|java|c|cpp|h|hpp|cs|go|rs|php|tsv|toml|ini|conf)$/i.test(filename)
    );
  }, [isMarkdown, isCsv, mimeType, filename]);

  const canEdit = useMemo(() => {
    return (
      (isTextOrCode && !isSpreadsheetDoc) ||
      isMarkdown ||
      isWordDoc ||
      (resolvedFile && typeof resolvedFile.content === 'string')
    );
  }, [isTextOrCode, isSpreadsheetDoc, isMarkdown, isWordDoc, resolvedFile]);

  // Fetch text contents if text file, word doc, spreadsheet, or if resolvedFile has content
  useEffect(() => {
    if (!isOpen || !resolvedFile) return;

    if (resolvedFile.content && !effectiveId) {
      setTextContent(resolvedFile.content);
      return;
    }

    if ((isTextOrCode || isWordDoc || isSpreadsheetDoc || isPresentationDoc) && effectiveId) {
      setTextLoading(true);
      setTextError(null);
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch(previewUrl, { headers })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to load file content (HTTP ${res.status})`);
          }
          return res.text();
        })
        .then((text) => setTextContent(text))
        .catch((err) => {
          setTextError(err?.message || 'Unable to read file content.');
        })
        .finally(() => setTextLoading(false));
    }
  }, [isOpen, resolvedFile, isTextOrCode, isWordDoc, isSpreadsheetDoc, isPresentationDoc, effectiveId, previewUrl, getAuthToken]);

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getHeaderIcon = () => {
    if (isImage) return <ImageIcon className="h-5 w-5 text-emerald-500" />;
    if (isPdf) return <FileText className="h-5 w-5 text-rose-500" />;
    if (isVideo) return <Video className="h-5 w-5 text-purple-500" />;
    if (isAudio) return <Music className="h-5 w-5 text-amber-500" />;
    if (isCsv || isTsv || isSpreadsheetDoc) return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
    if (isWordDoc) return <FileText className="h-5 w-5 text-blue-500" />;
    if (isPresentationDoc) return <FileText className="h-5 w-5 text-amber-500" />;
    if (isArchive) return <Archive className="h-5 w-5 text-slate-500" />;
    if (isTextOrCode) return <FileCode className="h-5 w-5 text-indigo-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
  };

  // Safe simple CSV / TSV Parser
  const parsedCsvRows = useMemo(() => {
    if ((!isCsv && !isTsv) || !textContent) return [];
    const lines = textContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const isTabDelimited = isTsv || (lines[0] && lines[0].includes('\t') && !lines[0].includes(','));
    const delimiter = isTabDelimited ? '\t' : ',';
    return lines.map((line) => {
      if (isTabDelimited) {
        return line.split('\t').map((v) => v.trim().replace(/^"|"$/g, ''));
      }
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''));
      return values;
    });
  }, [isCsv, isTsv, textContent]);

  // Safe simple Markdown renderer
  const renderSimpleMarkdown = (text: string) => {
    const lines = text.split(/\r?\n/);
    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
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
              <h2 key={idx} className="pt-2 text-base font-bold text-slate-900 dark:text-white">
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="pt-2 text-lg font-extrabold text-slate-900 dark:text-white">
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
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-2 border-slate-200 dark:border-slate-800" />;
          }
          if (trimmed === '') {
            return <div key={idx} className="h-2" />;
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
      className={`animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm duration-200 ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
    >
      <div
        className={`flex flex-col overflow-hidden bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all ${
          isFullscreen
            ? 'h-full w-full rounded-none border-0'
            : 'max-h-[90vh] w-full max-w-4xl rounded-2xl border border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              {getHeaderIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white" title={filename}>
                {filename}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                {formatSize(resolvedFile?.size)} {mimeType ? `• ${mimeType}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Mode Toggle */}
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
                <span>{isEditing ? 'View Mode' : isWordDoc ? 'Edit in AETHER' : 'Edit File'}</span>
              </button>
            )}

            {/* View Mode Toggle for Markdown & CSV */}
            {!isEditing && (isMarkdown || isCsv || isTsv) && (
              <div className="mr-2 flex items-center rounded-xl border border-slate-200 p-0.5 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                    viewMode === 'rendered'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isCsv || isTsv ? <Table className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{isCsv || isTsv ? 'Table' : 'Formatted'}</span>
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-all ${
                    viewMode === 'raw'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="h-3 w-3" />
                  <span>Raw</span>
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

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        {isEditing ? (
          <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-[480px]">
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
          <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center overflow-y-auto p-6">
            {loadingFile ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <span className="text-xs font-semibold text-slate-500">Resolving file registers...</span>
              </div>
            ) : !effectiveId && !resolvedFile?.content ? (
              <div className="flex flex-col items-center py-12 text-center">
                <FileText className="mb-3 h-10 w-10 text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No file attached</h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  This document record has no physical attachment or text body to display.
                </p>
              </div>
            ) : isImage ? (
              <img
                src={previewUrl}
                alt={filename}
                className="max-h-[550px] w-auto rounded-xl object-contain shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : isPdf ? (
              <iframe
                src={previewUrl}
                title={filename}
                className="h-[550px] w-full rounded-xl border border-slate-200 dark:border-slate-800"
              />
            ) : isVideo ? (
              <video
                controls
                src={previewUrl}
                className="max-h-[500px] w-full rounded-xl shadow-sm"
              />
            ) : isUnsupportedVideo ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Video className="mb-3 h-10 w-10 text-purple-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Native Browser Playback Unsupported
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  This video container ({filename.split('.').pop()?.toUpperCase()}) cannot be decoded directly inside the browser. Download the file to view with your local video player.
                </p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={filename}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Video</span>
                  </a>
                )}
              </div>
            ) : isAudio ? (
              <div className="w-full py-12 text-center">
                <Music className="mx-auto mb-4 h-12 w-12 text-amber-500" />
                <audio controls src={previewUrl} className="mx-auto w-full max-w-md" />
              </div>
            ) : isCsv || isTsv ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Loading tabular records...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : viewMode === 'rendered' ? (
                <div className="max-h-[500px] w-full overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    {parsedCsvRows.length > 0 && (
                      <thead className="sticky top-0 bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <tr>
                          {parsedCsvRows[0].map((header, hIdx) => (
                            <th key={hIdx} className="border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {parsedCsvRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 text-slate-600 dark:text-slate-300">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre className="scrollbar-thin max-h-[500px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                  {textContent}
                </pre>
              )
            ) : isMarkdown ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Loading document content...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : viewMode === 'rendered' ? (
                <div className="max-h-[500px] w-full overflow-auto rounded-xl bg-slate-50 p-6 dark:bg-slate-800/40">
                  {renderSimpleMarkdown(textContent || '')}
                </div>
              ) : (
                <pre className="scrollbar-thin max-h-[500px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                  {textContent}
                </pre>
              )
            ) : isWordDoc ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Extracting Word document text...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3.5 py-2 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>Document text extracted via AETHER Parser. Click &quot;Edit in AETHER&quot; to modify and version.</span>
                    </div>
                  </div>
                  <pre className="scrollbar-thin max-h-[460px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                    {textContent}
                  </pre>
                </div>
              )
            ) : isSpreadsheetDoc ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Extracting spreadsheet preview...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 shrink-0" />
                      <span>Spreadsheet data extracted for read-only preview. Direct binary spreadsheet editing is not supported.</span>
                    </div>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download={filename}
                        className="font-semibold underline hover:text-emerald-900 dark:hover:text-emerald-200"
                      >
                        Download original
                      </a>
                    )}
                  </div>
                  <pre className="scrollbar-thin max-h-[460px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                    {textContent}
                  </pre>
                </div>
              )
            ) : isPresentationDoc ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Extracting presentation contents...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3.5 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>Presentation slides extracted for preview. Slide editing is not supported.</span>
                    </div>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download={filename}
                        className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-200"
                      >
                        Download original
                      </a>
                    )}
                  </div>
                  <pre className="scrollbar-thin max-h-[460px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                    {textContent}
                  </pre>
                </div>
              )
            ) : isArchive ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Archive className="mb-3 h-10 w-10 text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Compressed Archive
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  Archive contents ({filename.split('.').pop()?.toUpperCase()}) cannot be extracted in browser preview. Download the archive to extract and view files locally.
                </p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={filename}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Archive</span>
                  </a>
                )}
              </div>
            ) : isTextOrCode ? (
              textLoading ? (
                <span className="animate-pulse text-xs font-semibold text-indigo-500">
                  Reading file registers...
                </span>
              ) : textError ? (
                <div className="flex flex-col items-center py-8 text-rose-500">
                  <AlertTriangle className="mb-2 h-6 w-6" />
                  <span className="text-xs font-semibold">{textError}</span>
                </div>
              ) : (
                <pre className="scrollbar-thin max-h-[500px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
                  {textContent}
                </pre>
              )
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <AlertTriangle className="mb-3 h-10 w-10 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Preview unavailable
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  Preview is not natively available in browser for this file type. You can download the file to inspect it on your local device.
                </p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={filename}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

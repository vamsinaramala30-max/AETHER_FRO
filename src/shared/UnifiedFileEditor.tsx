import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Save,
  RotateCcw,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  FileText,
  FileSpreadsheet,
  Eye,
  Columns,
  Code2,
  X,
  Clock,
  User,
  ArrowDownLeft,
  Download,
} from 'lucide-react';
import { apiClient } from '@/api/client';

export interface FileVersionItem {
  id: string;
  version: number;
  size: number;
  sizeStr: string;
  comment?: string;
  createdAt: string;
  createdBy: string;
}

export interface UnifiedFileEditorProps {
  fileId?: string;
  documentId?: string;
  filename: string;
  mimeType?: string;
  initialContent?: string;
  readOnly?: boolean;
  allowVersions?: boolean;
  onSave?: (newContent: string) => Promise<void>;
  onClose?: () => void;
  className?: string;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
type ViewMode = 'edit' | 'preview' | 'split';

export const UnifiedFileEditor: React.FC<UnifiedFileEditorProps> = ({
  fileId,
  documentId,
  filename,
  mimeType = 'text/plain',
  initialContent = '',
  readOnly = false,
  allowVersions = true,
  onSave,
  onClose,
  className = '',
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [savedContent, setSavedContent] = useState<string>(initialContent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [wrapLines, setWrapLines] = useState<boolean>(true);
  const [showVersions, setShowVersions] = useState<boolean>(false);
  const [versions, setVersions] = useState<FileVersionItem[]>([]);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isMarkdown = useMemo(() => {
    const ext = filename.toLowerCase();
    return (
      ext.endsWith('.md') ||
      ext.endsWith('.markdown') ||
      mimeType === 'text/markdown' ||
      mimeType === 'text/x-markdown'
    );
  }, [filename, mimeType]);

  const isCsv = useMemo(() => {
    return filename.toLowerCase().endsWith('.csv') || mimeType === 'text/csv';
  }, [filename, mimeType]);

  // Sync initial content if prop changes
  useEffect(() => {
    setContent(initialContent);
    setSavedContent(initialContent);
    setSaveStatus('saved');
  }, [initialContent]);

  // Sync line numbers scroll with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Perform Save
  const handlePerformSave = useCallback(
    async (textToSave: string, comment?: string) => {
      if (readOnly) return;
      setSaveStatus('saving');
      setErrorMessage(null);

      try {
        if (onSave) {
          await onSave(textToSave);
        } else if (fileId) {
          await apiClient.put(`/uploads/${fileId}/content`, {
            content: textToSave,
            comment: comment || 'Manual save',
          });
        } else if (documentId) {
          await apiClient.patch(`/knowledge/documents/${documentId}`, {
            description: textToSave,
          });
        }
        setSavedContent(textToSave);
        setSaveStatus('saved');
        setLastSavedAt(new Date());
      } catch (err: any) {
        setSaveStatus('error');
        setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to save changes');
      }
    },
    [fileId, documentId, onSave, readOnly],
  );

  // Content change handler with autosave debounce (3 seconds)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = e.target.value;
    setContent(nextText);
    setSaveStatus('unsaved');

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    if (!readOnly) {
      autosaveTimerRef.current = setTimeout(() => {
        void handlePerformSave(nextText, 'Autosaved changes');
      }, 3000);
    }
  };

  // Revert changes
  const handleRevert = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    setContent(savedContent);
    setSaveStatus('saved');
    setErrorMessage(null);
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (autosaveTimerRef.current) {
          clearTimeout(autosaveTimerRef.current);
        }
        void handlePerformSave(content, 'User manual save');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, handlePerformSave]);

  // Clean up autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  // Fetch versions
  const loadVersions = useCallback(async () => {
    if (!fileId) return;
    setLoadingVersions(true);
    try {
      const res = await apiClient.get<any>(`/uploads/${fileId}/versions`);
      const list = res.data || res;
      setVersions(Array.isArray(list) ? list : []);
    } catch {
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  }, [fileId]);

  useEffect(() => {
    if (showVersions && fileId) {
      void loadVersions();
    }
  }, [showVersions, fileId, loadVersions]);

  // Restore historic version
  const handleRestoreVersion = async (version: FileVersionItem) => {
    if (!fileId || readOnly) return;
    if (!window.confirm(`Restore file to Version ${version.version}? Current state will be saved as a new version.`)) {
      return;
    }
    setRestoringVersionId(version.id);
    try {
      await apiClient.post<any>(`/uploads/${fileId}/versions/${version.id}/restore`);
      // Reload active content via extract-text
      const textRes = await apiClient.post<any>(`/uploads/${fileId}/extract-text`);
      const payload = textRes.data || textRes;
      const restoredText = payload?.text || payload?.data?.text || '';
      setContent(restoredText);
      setSavedContent(restoredText);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      setShowVersions(false);
      void loadVersions();
      if (onSave) {
        await onSave(restoredText);
      }
    } catch (err: any) {
      alert(`Failed to restore version: ${err?.message || 'Unknown error'}`);
    } finally {
      setRestoringVersionId(null);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const exportName = filename.toLowerCase().endsWith('.docx')
      ? filename.replace(/\.docx$/i, '.txt')
      : filename;
    a.download = exportName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Compute metrics
  const linesCount = useMemo(() => content.split('\n').length, [content]);
  const charsCount = content.length;
  const hasChanges = content !== savedContent;

  // Simple Markdown renderer
  const renderMarkdownPreview = (text: string) => {
    const lines = text.split(/\r?\n/);
    return (
      <div className="space-y-2 p-6 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="pt-2 text-base font-bold text-slate-900 dark:text-white">
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="pt-3 text-lg font-bold text-slate-900 dark:text-white">
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="pt-4 text-xl font-extrabold text-slate-900 dark:text-white">
                {trimmed.replace(/^#\s+/, '')}
              </h1>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-slate-700 dark:text-slate-300">
                {trimmed.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="my-3 border-slate-200 dark:border-slate-800" />;
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

  return (
    <div
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden ${className}`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        {/* Left: File info & status */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {isMarkdown ? (
              <FileText className="h-4 w-4" />
            ) : isCsv ? (
              <FileSpreadsheet className="h-4 w-4" />
            ) : (
              <FileCode className="h-4 w-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                {filename}
              </span>
              {hasChanges && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  Unsaved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>{linesCount} lines</span>
              <span>•</span>
              <span>{charsCount} chars</span>
            </div>
          </div>
        </div>

        {/* Center: Save Status Indicator */}
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Autosaving...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                Saved {lastSavedAt ? `at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
              </span>
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved changes (autosaving in 3s...)</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500" title={errorMessage || 'Error saving'}>
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Save failed</span>
            </span>
          )}
        </div>

        {/* Right: View toggles & actions */}
        <div className="flex items-center gap-2">
          {/* Markdown View Toggle */}
          {isMarkdown && (
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'edit'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Columns className="h-3 w-3" />
                <span>Split</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>Preview</span>
              </button>
            </div>
          )}

          {/* Versions Drawer Toggle */}
          {allowVersions && fileId && (
            <button
              type="button"
              onClick={() => setShowVersions(!showVersions)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                showVersions
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Versions</span>
            </button>
          )}

          {/* Revert Button */}
          {hasChanges && !readOnly && (
            <button
              type="button"
              onClick={handleRevert}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Revert to last saved state"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Revert</span>
            </button>
          )}

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Export content as file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          {/* Manual Save Button */}
          {!readOnly && (
            <button
              type="button"
              onClick={() => handlePerformSave(content, 'Manual save')}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save</span>
              <kbd className="hidden rounded bg-indigo-700/60 px-1 py-0.5 text-[9px] sm:inline-block">
                ⌘S
              </kbd>
            </button>
          )}

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="relative flex flex-1 overflow-hidden min-h-[450px]">
        {/* Main Editor / Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Container (visible in 'edit' and 'split' mode) */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div
              className={`flex flex-1 overflow-hidden bg-slate-950 font-mono text-xs ${
                viewMode === 'split' ? 'border-r border-slate-800' : ''
              }`}
            >
              {/* Line Numbers Gutter */}
              {showLineNumbers && (
                <div
                  ref={lineNumbersRef}
                  className="select-none overflow-hidden bg-slate-900/60 py-4 pl-3 pr-2 text-right font-mono text-[11px] leading-relaxed text-slate-500"
                  style={{ width: '42px' }}
                >
                  {Array.from({ length: linesCount }, (_, i) => (
                    <div key={i + 1}>{i + 1}</div>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleChange}
                onScroll={handleScroll}
                readOnly={readOnly}
                spellCheck={false}
                placeholder="Enter text, markdown, or code here..."
                className={`flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none placeholder:text-slate-600 ${
                  wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
                }`}
              />
            </div>
          )}

          {/* Markdown Preview Container (visible in 'preview' and 'split' mode) */}
          {isMarkdown && (viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
              {renderMarkdownPreview(content)}
            </div>
          )}
        </div>

        {/* Version History Drawer */}
        {allowVersions && fileId && showVersions && (
          <div className="w-80 border-l border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 overflow-y-auto">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                <History className="h-4 w-4 text-indigo-500" />
                <span>Version History</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVersions(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {loadingVersions ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                <span className="text-xs">Loading versions...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-800">
                No previous versions recorded yet. Versions are created automatically whenever you edit and save.
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Version {ver.version}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {ver.sizeStr}
                      </span>
                    </div>

                    {ver.comment && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {ver.comment}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(ver.createdAt).toLocaleDateString()} {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{ver.createdBy}</span>
                      </div>
                    </div>

                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(ver)}
                        disabled={restoringVersionId === ver.id}
                        className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 disabled:opacity-50"
                      >
                        {restoringVersionId === ver.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        )}
                        <span>Restore this version</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

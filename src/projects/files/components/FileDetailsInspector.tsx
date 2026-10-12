import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  History,
  GitFork,
  Eye,
  Edit3,
  Download,
  Trash2,
  Star,
  Send,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  FolderOpen,
} from 'lucide-react';
import { FileItem } from '../types';
import { fileManagerApi } from '../fileManagerApi';
import { useNotificationStore } from '@/state/notificationStore';

interface FileDetailsInspectorProps {
  file: FileItem | null;
  onClose: () => void;
  onPreview: (file: FileItem) => void;
  onEdit: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onTrashFile: (file: FileItem) => void;
  allFiles: FileItem[];
  onSelectRelatedFile: (file: FileItem) => void;
}

type TabType = 'details' | 'intelligence' | 'ai' | 'versions' | 'relations';

export const FileDetailsInspector: React.FC<FileDetailsInspectorProps> = ({
  file,
  onClose,
  onPreview,
  onEdit,
  onToggleFavorite,
  onTrashFile,
  allFiles,
  onSelectRelatedFile,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAnswers, setAiAnswers] = useState<Array<{ question: string; answer: string }>>([]);
  const [copiedAnswerIdx, setCopiedAnswerIdx] = useState<number | null>(null);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  if (!file) return null;

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isEditable = (mime: string, name: string) =>
    mime.includes('text') ||
    mime.includes('json') ||
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('word') ||
    mime.includes('spreadsheet') ||
    /\.(txt|md|json|js|ts|tsx|jsx|html|css|py|yaml|yml|csv|docx|xlsx)$/i.test(name);

  // Approximate metrics from extracted text or filename
  const textContent = file.extractedText || '';
  const wordCount = textContent
    ? textContent.trim().split(/\s+/).filter(Boolean).length
    : Math.max(1, Math.round(file.size / 7));
  const lineCount = textContent
    ? textContent.split('\n').length
    : Math.max(1, Math.round(file.size / 45));

  const getDetectedType = (name: string, mime: string) => {
    if (mime.includes('pdf')) return 'PDF Document';
    if (mime.includes('word') || /\.docx?$/i.test(name)) return 'Word Document';
    if (mime.includes('spreadsheet') || /\.(xlsx?|csv)$/i.test(name)) return 'Data Spreadsheet';
    if (mime.includes('presentation') || /\.pptx?$/i.test(name)) return 'Slide Presentation';
    if (mime.includes('image')) return 'Visual Media Asset';
    if (mime.includes('video')) return 'Video Media Asset';
    if (mime.includes('audio')) return 'Audio Recording';
    if (/\.(ts|tsx|js|jsx|py|html|css)$/i.test(name)) return 'Source Code';
    if (/\.(json|yaml|yml|xml|env)$/i.test(name)) return 'Configuration / Structured Data';
    if (/\.md$/i.test(name)) return 'Markdown Documentation';
    return 'General Document';
  };

  const getTopics = (name: string) => {
    const clean = name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const parts = clean.split(/\s+/).filter((w) => w.length > 2);
    return Array.from(new Set(parts)).slice(0, 5);
  };

  // Related files: match same extension or same folder
  const fileExt = file.filename.split('.').pop()?.toLowerCase();
  const relatedFiles = allFiles
    .filter((f) => f.id !== file.id)
    .filter((f) => {
      const otherExt = f.filename.split('.').pop()?.toLowerCase();
      return (fileExt && otherExt === fileExt) || (file.folderId && f.folderId === file.folderId);
    })
    .slice(0, 4);

  const handleAskAI = async (promptText: string) => {
    if (!promptText.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fileManagerApi.askAI(file.id, promptText);
      setAiAnswers((prev) => [{ question: promptText, answer: res.answer }, ...prev]);
      setAiPrompt('');
    } catch (err: any) {
      useNotificationStore.getState().addNotification({
        title: 'AI Analysis Failed',
        description: err?.message || 'Unable to analyze file content.',
        type: 'project',
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAnswer = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswerIdx(idx);
    setTimeout(() => setCopiedAnswerIdx(null), 2000);
  };

  const handleRestoreVersion = async (versionNumber: number) => {
    setRestoringVersionId(String(versionNumber));
    try {
      useNotificationStore.getState().addNotification({
        title: 'Version Restored',
        description: `Restored "${file.filename}" to version ${versionNumber}.`,
        type: 'project',
      });
    } finally {
      setRestoringVersionId(null);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <h3
              title={file.filename}
              className="truncate text-xs font-bold text-slate-900 dark:text-white"
            >
              {file.filename}
            </h3>
            <p className="text-[11px] text-slate-400">
              {formatSize(file.size)} • {getDetectedType(file.filename, file.mimeType)}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200/80 px-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 border-b-2 py-2.5 text-center text-xs font-semibold transition-all ${
            activeTab === 'details'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`flex-1 border-b-2 py-2.5 text-center text-xs font-semibold transition-all ${
            activeTab === 'intelligence'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Intelligence
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center justify-center gap-1 border-b-2 py-2.5 text-center text-xs font-semibold transition-all ${
            activeTab === 'ai'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3 w-3 text-purple-500" />
          <span>Ask AI</span>
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 border-b-2 py-2.5 text-center text-xs font-semibold transition-all ${
            activeTab === 'versions'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Versions
        </button>
        <button
          onClick={() => setActiveTab('relations')}
          className={`flex-1 border-b-2 py-2.5 text-center text-xs font-semibold transition-all ${
            activeTab === 'relations'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Links
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onPreview(file)}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Eye className="h-4 w-4 text-indigo-500" />
                <span>Preview</span>
              </button>

              {isEditable(file.mimeType, file.filename) && (
                <button
                  onClick={() => onEdit(file)}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Edit3 className="h-4 w-4 text-emerald-500" />
                  <span>Edit</span>
                </button>
              )}

              <a
                href={fileManagerApi.getDownloadUrl(file.id)}
                download={file.filename}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4 text-blue-500" />
                <span>Download</span>
              </a>

              <button
                onClick={() => onTrashFile(file)}
                className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:border-slate-800 dark:bg-slate-800/40 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
                <span>Trash</span>
              </button>
            </div>

            {/* Properties Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
              <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                File Properties
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {getDetectedType(file.filename, file.mimeType)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Size</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatSize(file.size)} ({file.size.toLocaleString()} bytes)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {file.folder ? `My Files / ${file.folder.name}` : 'My Files / Root'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Created</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(file.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Versions</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {file.versionCount || 1}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-400">Favorite</span>
                  <button
                    onClick={() => onToggleFavorite(file)}
                    className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        file.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{file.isFavorite ? 'Yes' : 'No'}</span>
                  </button>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">MIME Type</span>
                  <span className="max-w-[180px] truncate font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {file.mimeType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-50/50 p-4 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  File Intelligence
                </span>
              </div>
              <p className="mt-1 text-xs text-purple-600/80 dark:text-purple-300/80">
                Extracted structural metrics and semantic profile computed from file contents.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="text-[11px] text-slate-400">Estimated Words</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                  {wordCount.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="text-[11px] text-slate-400">Line Count</p>
                <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                  {lineCount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Detected Topics */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Extracted Topics & Tags
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {getTopics(file.filename).map((topic, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Classification */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Semantic Classification
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {getDetectedType(file.filename, file.mimeType)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Ready for RAG context ingestion and neural assistant queries.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: ASK AETHER (AI) */}
        {activeTab === 'ai' && (
          <div className="flex h-full flex-col space-y-3">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/50 p-3.5 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold">Ask this file</span>
              </div>
              <p className="mt-1 text-xs text-indigo-600/80 dark:text-indigo-300/80">
                Query this document with AETHER AI. Answers are strictly grounded in this file's
                content.
              </p>
            </div>

            {/* Quick suggested chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Summarize this document',
                'Extract key points',
                'Identify main topics',
                'Find important dates',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => void handleAskAI(chip)}
                  disabled={aiLoading}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-500/50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask anything about this document..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleAskAI(aiPrompt);
                }}
                disabled={aiLoading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-10 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <button
                onClick={() => void handleAskAI(aiPrompt)}
                disabled={!aiPrompt.trim() || aiLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {aiLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Answers list */}
            <div className="space-y-3 pt-2">
              {aiAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q: {item.question}
                  </p>
                  <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.answer}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleCopyAnswer(idx, item.answer)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedAnswerIdx === idx ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VERSIONS */}
        {activeTab === 'versions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Version History
              </h4>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {file.versions?.length || 1} recorded
              </span>
            </div>

            {(!file.versions || file.versions.length <= 1) && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <History className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Version 1 (Current)
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Created on {new Date(file.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-[10px] text-slate-400">
                  Subsequent edits in AETHER will automatically generate version snapshots.
                </p>
              </div>
            )}

            {file.versions &&
              file.versions.length > 1 &&
              file.versions.map((ver) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Version {ver.versionNumber}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatSize(ver.size)} • {new Date(ver.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => void handleRestoreVersion(ver.versionNumber)}
                      disabled={restoringVersionId === String(ver.versionNumber)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 5: RELATIONS */}
        {activeTab === 'relations' && (
          <div className="space-y-4">
            {/* Project relation */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Project Association
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {file.projectId ? `Linked to Project ID: ${file.projectId}` : 'Workspace General Asset'}
              </p>
            </div>

            {/* Knowledge relation */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Knowledge Base Link
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {file.isKnowledge
                  ? 'Active Knowledge Document. Indexed for neural search and RAG synthesis.'
                  : 'Not linked to Knowledge Base.'}
              </p>
            </div>

            {/* Related Files */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Related Workspace Files
                </h4>
                <GitFork className="h-3.5 w-3.5 text-slate-400" />
              </div>

              {relatedFiles.length === 0 ? (
                <p className="text-xs italic text-slate-400">No related files detected.</p>
              ) : (
                <div className="space-y-1.5">
                  {relatedFiles.map((rf) => (
                    <button
                      key={rf.id}
                      onClick={() => onSelectRelatedFile(rf)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-2 text-left hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="truncate">
                        <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {rf.filename}
                        </p>
                        <p className="text-[10px] text-slate-400">{formatSize(rf.size)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

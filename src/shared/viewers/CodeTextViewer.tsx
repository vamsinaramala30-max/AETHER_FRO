import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Search,
  WrapText,
  FileCode,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export interface CodeTextViewerProps {
  content: string;
  filename: string;
  mimeType?: string;
  downloadUrl?: string;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

export const CodeTextViewer: React.FC<CodeTextViewerProps> = ({
  content,
  filename,
  mimeType: _mimeType,
  downloadUrl,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const lines = useMemo(() => {
    return content.split(/\r?\n/);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const lower = searchQuery.toLowerCase();
    return lines.reduce((acc, line) => {
      const occurrences = (line.toLowerCase().match(new RegExp(lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      return acc + occurrences;
    }, 0);
  }, [searchQuery, lines]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2 text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileCode className="h-4 w-4 shrink-0 text-indigo-400" />
          <span className="font-semibold text-slate-200 truncate max-w-xs">{filename}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
            {lines.length} lines • {content.length} chars
          </span>
          <span className="rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 text-[9px] font-bold">
            Read-only
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in file..."
              className="h-7 w-36 rounded-lg border border-slate-800 bg-slate-950 pl-7 pr-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            {searchQuery && (
              <span className="ml-1.5 text-[10px] text-slate-400">
                {matchCount} match{matchCount === 1 ? '' : 'es'}
              </span>
            )}
          </div>

          {/* Word Wrap Toggle */}
          <button
            type="button"
            onClick={() => setWordWrap(!wordWrap)}
            title={wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-sans font-medium transition-colors ${
              wordWrap
                ? 'border-indigo-500/50 bg-indigo-950/50 text-indigo-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <WrapText className="h-3.5 w-3.5" />
            <span>Wrap</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-sans font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              title="Download file"
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-sans font-semibold text-white shadow hover:bg-indigo-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}

          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex-1 overflow-auto max-h-[65vh]">
        <div className="flex min-w-full">
          {/* Line Numbers Column */}
          <div className="select-none bg-slate-900/60 px-3 py-3 text-right font-mono text-slate-600 border-r border-slate-800/80">
            {lines.map((_, i) => (
              <div key={i} className="leading-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Text Content */}
          <div
            className={`flex-1 p-3 font-mono leading-5 ${
              wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'
            }`}
          >
            {lines.map((line, i) => {
              const isMatch =
                searchQuery.trim().length > 0 &&
                line.toLowerCase().includes(searchQuery.toLowerCase());
              return (
                <div
                  key={i}
                  className={`${isMatch ? 'bg-amber-500/20 text-amber-200 rounded px-1' : ''}`}
                >
                  {line || ' '}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

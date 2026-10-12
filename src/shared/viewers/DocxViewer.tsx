import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Download,
  BookOpen,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export interface DocxViewerProps {
  content?: string;
  filename: string;
  downloadUrl?: string;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

export const DocxViewer: React.FC<DocxViewerProps> = ({
  content = '',
  filename,
  downloadUrl,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const paragraphs = useMemo(() => {
    if (!content) return [];
    return content
      .split(/\r?\n\r?\n|\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [content]);

  const wordCount = useMemo(() => {
    return content ? content.split(/\s+/).filter(Boolean).length : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Document Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{filename}</span>
          <span className="rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
            {wordCount} words • ~{readingTime} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search in Document */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find text..."
              className="h-7 w-32 rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-1 py-0.5">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(prev - 10, 70))}
              className="rounded p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[36px] text-center text-[10px] font-mono">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(prev + 10, 150))}
              className="rounded p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow hover:bg-blue-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Document Viewport - Styled as an A4 page */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center max-h-[65vh]">
        <div
          style={{ zoom: `${zoom}%` }}
          className="w-full max-w-3xl rounded-xl border border-slate-200/90 bg-white p-8 sm:p-14 shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-all"
        >
          {paragraphs.length > 0 ? (
            <div className="space-y-4 text-justify font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {paragraphs.map((p, idx) => {
                const trimmed = p.trim();
                const isMatch =
                  searchQuery.trim().length > 0 &&
                  trimmed.toLowerCase().includes(searchQuery.toLowerCase());

                // Title heading logic for first paragraph or short heading-like line
                if (idx === 0 && trimmed.length < 90) {
                  return (
                    <h1
                      key={idx}
                      className={`text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 ${
                        isMatch ? 'bg-amber-100 dark:bg-amber-950/60' : ''
                      }`}
                    >
                      {trimmed}
                    </h1>
                  );
                }

                // Sub-heading logic
                if (
                  trimmed.length < 60 &&
                  (trimmed.endsWith(':') || /^[0-9]+[.]\s+[A-Z]/.test(trimmed) || /^[A-Z0-9\s.-]+$/.test(trimmed))
                ) {
                  return (
                    <h2
                      key={idx}
                      className={`text-base font-bold text-slate-900 dark:text-white pt-2 ${
                        isMatch ? 'bg-amber-100 dark:bg-amber-950/60' : ''
                      }`}
                    >
                      {trimmed}
                    </h2>
                  );
                }

                // Bullet item
                if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  return (
                    <li
                      key={idx}
                      className={`ml-5 list-disc text-slate-700 dark:text-slate-300 ${
                        isMatch ? 'bg-amber-100 dark:bg-amber-950/60' : ''
                      }`}
                    >
                      {trimmed.replace(/^[-*•]\s*/, '')}
                    </li>
                  );
                }

                return (
                  <p
                    key={idx}
                    className={`${isMatch ? 'bg-amber-100 dark:bg-amber-950/60 rounded px-1' : ''}`}
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <BookOpen className="mx-auto mb-2 h-10 w-10 opacity-30" />
              <p className="text-sm font-semibold">Empty document or binary contents preserved.</p>
              <p className="mt-1 text-xs">Download the file to inspect with Microsoft Word.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

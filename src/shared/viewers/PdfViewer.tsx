import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { formatFileSize } from '../fileCapabilityDetector';

export interface PdfViewerProps {
  url: string;
  downloadUrl?: string;
  filename: string;
  size?: number;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  url,
  downloadUrl,
  filename,
  size,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const [key, setKey] = useState<number>(0);

  const handleReload = () => setKey((prev) => prev + 1);

  return (
    <div className="relative flex h-full min-h-[520px] w-full flex-col overflow-hidden rounded-xl bg-slate-900">
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="truncate text-xs font-semibold text-slate-200" title={filename}>
            {filename}
          </span>
          {size && size > 0 && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
              {formatFileSize(size)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReload}
            title="Reload PDF View"
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Original in New Tab"
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              title="Download PDF"
              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-rose-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Embedded PDF Viewport */}
      <div className="relative flex-1 w-full bg-slate-900">
        <iframe
          key={key}
          src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
          title={filename}
          className="h-full min-h-[500px] w-full border-0"
        />
      </div>
    </div>
  );
};

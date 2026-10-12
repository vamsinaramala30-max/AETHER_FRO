import React from 'react';
import { FileQuestion, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { formatFileSize } from '../fileCapabilityDetector';

export interface UnsupportedViewerProps {
  filename: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  originalUrl?: string;
}

export const UnsupportedViewer: React.FC<UnsupportedViewerProps> = ({
  filename,
  mimeType,
  size,
  downloadUrl,
  originalUrl,
}) => {
  return (
    <div className="flex min-h-[380px] w-full flex-col items-center justify-center p-8 text-center bg-slate-950 text-white rounded-xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 border border-slate-700">
        <FileQuestion className="h-8 w-8" />
      </div>

      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
        Unknown File Type
      </span>
      <h3 className="mt-1 text-base font-bold text-slate-100 max-w-md truncate" title={filename}>
        {filename}
      </h3>

      <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">Type:</span>
          <span className="text-slate-200">{mimeType || 'application/octet-stream'}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">Size:</span>
          <span className="text-slate-200">{formatFileSize(size)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">Preview:</span>
          <span className="text-amber-400 font-semibold">Not available in browser</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
        <ShieldCheck className="h-4 w-4" />
        <span>File securely preserved in cloud storage</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {originalUrl && (
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open Original</span>
          </a>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={filename}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </a>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Download, AlertTriangle } from 'lucide-react';
import { ImageViewer } from './viewers/ImageViewer';
import { PdfViewer } from './viewers/PdfViewer';
import { CodeTextViewer } from './viewers/CodeTextViewer';
import { JsonViewer } from './viewers/JsonViewer';
import { SpreadsheetViewer } from './viewers/SpreadsheetViewer';
import { DocxViewer } from './viewers/DocxViewer';
import { PresentationViewer } from './viewers/PresentationViewer';
import { AudioViewer } from './viewers/AudioViewer';
import { VideoViewer } from './viewers/VideoViewer';
import { ArchiveViewer } from './viewers/ArchiveViewer';
import { UnsupportedViewer } from './viewers/UnsupportedViewer';
import { FileViewerType } from './fileCapabilityDetector';

export const ImagePreview = ImageViewer;
export const PdfPreview = PdfViewer;
export const VideoPreview = VideoViewer;
export const AudioPreview = AudioViewer;
export const DocumentPreview = DocxViewer;
export const SpreadsheetPreview = SpreadsheetViewer;
export const PresentationPreview = PresentationViewer;
export const CodePreview = CodeTextViewer;
export const TextPreview = CodeTextViewer;
export const JsonPreview = JsonViewer;
export const ArchivePreview = ArchiveViewer;
export const UnsupportedPreview = UnsupportedViewer;

export interface FilePreviewProps {
  viewerType: FileViewerType;
  filename: string;
  mimeType: string;
  size?: number;
  url?: string;
  downloadUrl?: string;
  content?: string | null;
  loading?: boolean;
  error?: string | null;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  markdownViewMode?: 'rendered' | 'source';
  renderMarkdownFormatted?: (content: string) => React.ReactNode;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  viewerType,
  filename,
  mimeType,
  size,
  url,
  downloadUrl,
  content,
  loading = false,
  error = null,
  isFullscreen = false,
  onFullscreenToggle,
  markdownViewMode = 'rendered',
  renderMarkdownFormatted,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-xs font-semibold text-slate-500">Loading preview from cloud...</span>
      </div>
    );
  }

  if (error && !['image', 'pdf', 'video', 'audio', 'archive'].includes(viewerType)) {
    return (
      <div className="flex flex-col items-center py-12 text-center text-rose-500">
        <AlertTriangle className="mb-2 h-8 w-8" />
        <h4 className="text-sm font-bold">Could not load preview</h4>
        <p className="mt-1 max-w-sm text-xs text-slate-500">{error}</p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={filename}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Original</span>
          </a>
        )}
      </div>
    );
  }

  switch (viewerType) {
    case 'image':
      return (
        <ImagePreview
          url={url || ''}
          downloadUrl={downloadUrl}
          filename={filename}
          mimeType={mimeType}
          size={size}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'pdf':
      return (
        <PdfPreview
          url={url || ''}
          downloadUrl={downloadUrl}
          filename={filename}
          size={size}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'video':
      return (
        <VideoPreview
          url={url || ''}
          downloadUrl={downloadUrl}
          filename={filename}
          mimeType={mimeType}
          size={size}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'audio':
      return (
        <AudioPreview
          url={url || ''}
          downloadUrl={downloadUrl}
          filename={filename}
          size={size}
        />
      );

    case 'csv':
    case 'spreadsheet':
      return (
        <SpreadsheetPreview
          content={content || ''}
          filename={filename}
          downloadUrl={downloadUrl}
        />
      );

    case 'docx':
      return (
        <DocumentPreview
          content={content || ''}
          filename={filename}
          downloadUrl={downloadUrl}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'pptx':
      return (
        <PresentationPreview
          content={content || ''}
          filename={filename}
          downloadUrl={downloadUrl}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'archive':
      return (
        <ArchivePreview
          url={url || ''}
          filename={filename}
          size={size}
          downloadUrl={downloadUrl}
        />
      );

    case 'markdown':
      if (markdownViewMode === 'rendered' && renderMarkdownFormatted) {
        return (
          <div className="w-full max-h-[65vh] overflow-auto">
            {renderMarkdownFormatted(content || '')}
          </div>
        );
      }
      return (
        <CodePreview
          content={content || ''}
          filename={filename}
          mimeType={mimeType || 'text/markdown'}
          downloadUrl={downloadUrl}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    case 'code':
    case 'text':
      if (filename.toLowerCase().endsWith('.json') || mimeType.includes('json')) {
        return (
          <JsonPreview
            content={content || '{}'}
            filename={filename}
            downloadUrl={downloadUrl}
          />
        );
      }
      return (
        <CodePreview
          content={content || ''}
          filename={filename}
          mimeType={mimeType}
          downloadUrl={downloadUrl}
          onFullscreenToggle={onFullscreenToggle}
          isFullscreen={isFullscreen}
        />
      );

    default:
      return (
        <UnsupportedPreview
          filename={filename}
          mimeType={mimeType}
          size={size}
          downloadUrl={downloadUrl}
        />
      );
  }
};

import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { formatFileSize } from '../fileCapabilityDetector';

export interface ImageViewerProps {
  url: string;
  downloadUrl?: string;
  filename: string;
  mimeType?: string;
  size?: number;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  url,
  downloadUrl,
  filename,
  mimeType,
  size,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setIsLoaded(true);
    setHasError(false);
  };

  useEffect(() => {
    setScale(1);
    setRotation(0);
    setIsLoaded(false);
    setHasError(false);
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl bg-slate-950 select-none"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 z-20 flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-1.5 backdrop-blur-md shadow-lg">
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-25%)"
          disabled={scale <= 0.25}
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[44px] text-center text-xs font-mono font-medium text-slate-200">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+25%)"
          disabled={scale >= 4}
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-white/20" />

        <button
          type="button"
          onClick={handleResetZoom}
          title="Reset Zoom & Rotation"
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleRotate}
          title="Rotate 90° Clockwise"
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {onFullscreenToggle && (
          <button
            type="button"
            onClick={onFullscreenToggle}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}

        <div className="mx-1 h-4 w-px bg-white/20" />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Original in New Tab"
          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={filename}
            title="Download Original"
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex flex-1 w-full items-center justify-center overflow-auto p-4">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-400">Loading original resolution...</span>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400">
            <ImageIcon className="h-12 w-12 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">Unable to render image</p>
            <p className="max-w-xs text-xs text-slate-500">
              The image could not be loaded into memory or uses an unsupported browser format.
            </p>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={filename}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Original</span>
              </a>
            )}
          </div>
        ) : (
          <img
            src={url}
            alt={filename}
            onLoad={handleImageLoad}
            onError={() => setHasError(true)}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl transition-all"
          />
        )}
      </div>

      {/* Bottom Metadata Bar */}
      <div className="z-10 flex w-full flex-wrap items-center justify-between border-t border-white/10 bg-slate-900/90 px-4 py-2 text-[11px] text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 truncate max-w-xs">{filename}</span>
          {dimensions && (
            <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-slate-300">
              {dimensions.width} × {dimensions.height} px
            </span>
          )}
          {size && size > 0 && <span>{formatFileSize(size)}</span>}
        </div>
        <div className="flex items-center gap-3">
          {mimeType && <span className="font-mono text-slate-400">{mimeType}</span>}
          <span className="text-emerald-400 font-semibold">● Original Uncompressed</span>
        </div>
      </div>
    </div>
  );
};

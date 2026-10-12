import React, { useState, useRef, useMemo } from 'react';
import {
  Video as VideoIcon,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export interface VideoViewerProps {
  url: string;
  filename: string;
  mimeType?: string;
  size?: number;
  downloadUrl?: string;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

export const VideoViewer: React.FC<VideoViewerProps> = ({
  url,
  filename,
  mimeType,
  size: _size,
  downloadUrl,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCodecError, setHasCodecError] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);

  // Check if file is known to be an unsupported container in browsers (.avi, .mkv, .wmv, .flv)
  const isKnownUnsupportedContainer = useMemo(() => {
    return /\.(avi|mkv|wmv|flv)$/i.test(filename) ||
      (mimeType && (mimeType.includes('msvideo') || mimeType.includes('matroska')));
  }, [filename, mimeType]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  if (isKnownUnsupportedContainer || hasCodecError) {
    return (
      <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-8 text-center bg-slate-950 text-white rounded-xl">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <VideoIcon className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-slate-100">
          Preview unavailable for this codec
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-slate-400 leading-relaxed">
          The container format or video codec ({filename.split('.').pop()?.toUpperCase()}) is not supported for native decoding by standard web browsers. The original video file is safely and immutably preserved in AETHER OS.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open Original</span>
          </a>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500"
            >
              <Download className="h-4 w-4" />
              <span>Download Video</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-white">
      {/* Top Floating Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
        <div className="pointer-events-auto rounded-xl bg-slate-900/80 px-3 py-1 backdrop-blur-md border border-white/10">
          <span className="font-semibold text-slate-200">{filename}</span>
          {videoDimensions && (
            <span className="ml-2 font-mono text-[10px] text-slate-400">
              {videoDimensions.width}x{videoDimensions.height}
            </span>
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-xl bg-slate-900/80 p-2 text-slate-300 backdrop-blur-md border border-white/10 hover:bg-slate-800"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              title="Download Video"
              className="rounded-xl bg-slate-900/80 p-2 text-slate-300 backdrop-blur-md border border-white/10 hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Video Viewport */}
      <video
        ref={videoRef}
        controls
        src={url}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => setHasCodecError(true)}
        className="max-h-[70vh] w-full rounded-xl shadow-2xl object-contain bg-black"
      />
    </div>
  );
};

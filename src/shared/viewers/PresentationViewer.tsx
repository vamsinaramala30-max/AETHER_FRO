import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  MonitorPlay,
} from 'lucide-react';

export interface PresentationViewerProps {
  content?: string;
  filename: string;
  downloadUrl?: string;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
}

interface ParsedSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  content = '',
  filename,
  downloadUrl,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Parse slides separated by --- Slide N ---
  const slides: ParsedSlide[] = useMemo(() => {
    if (!content) {
      return [{ slideNumber: 1, title: filename, bullets: ['Presentation deck preserved in AETHER.'] }];
    }

    const sections = content.split(/--- Slide (\d+) ---\r?\n/);
    if (sections.length > 1) {
      const parsed: ParsedSlide[] = [];
      for (let i = 1; i < sections.length; i += 2) {
        const slideNum = parseInt(sections[i], 10) || parsed.length + 1;
        const slideText = sections[i + 1] || '';
        const lines = slideText
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        const title = lines.length > 0 ? lines[0] : `Slide ${slideNum}`;
        const bullets = lines.length > 1 ? lines.slice(1) : [];
        parsed.push({ slideNumber: slideNum, title, bullets });
      }
      return parsed.length > 0
        ? parsed
        : [{ slideNumber: 1, title: filename, bullets: [] }];
    }

    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    return [
      {
        slideNumber: 1,
        title: lines[0] || filename,
        bullets: lines.slice(1),
      },
    ];
  }, [content, filename]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-white">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <MonitorPlay className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="font-semibold text-xs text-slate-200 truncate max-w-xs">{filename}</span>
          <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow hover:bg-amber-500"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Slide Presentation Viewport */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 max-h-[60vh] overflow-auto">
        <div className="relative flex aspect-video w-full max-w-3xl flex-col justify-between rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 p-8 sm:p-12 shadow-2xl overflow-y-auto">
          {/* Slide Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-300">
              Slide {activeSlide.slideNumber}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-xs">{filename}</span>
          </div>

          {/* Slide Content */}
          <div className="my-auto py-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeSlide.title}
            </h2>
            {activeSlide.bullets.length > 0 && (
              <div className="space-y-2 text-sm sm:text-base text-slate-300">
                {activeSlide.bullets.map((b, bIdx) => (
                  <p key={bIdx} className="leading-relaxed">
                    • {b}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Slide Navigation Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIndex === dotIdx
                      ? 'w-6 bg-indigo-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  title={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={currentSlideIndex >= slides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

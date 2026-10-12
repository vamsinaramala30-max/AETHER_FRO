import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Upload } from 'lucide-react';

export type FileProcessingStatus = 'uploaded' | 'processing' | 'indexed' | 'ai-ready' | 'READY' | 'PROCESSING' | 'INDEXED' | string;

interface FileStatusBadgeProps {
  status: FileProcessingStatus;
  compact?: boolean;
}

export const FileStatusBadge: React.FC<FileStatusBadgeProps> = ({ status, compact = false }) => {
  const normalized = status?.toLowerCase?.() || 'ready';

  if (normalized === 'processing') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'}`}>
        <Loader2 className={`animate-spin ${compact ? 'h-2 w-2' : 'h-2.5 w-2.5'}`} />
        {!compact && 'Processing'}
      </span>
    );
  }

  if (normalized === 'indexed') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'}`}>
        <CheckCircle2 className={compact ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
        {!compact && 'Indexed'}
      </span>
    );
  }

  if (normalized === 'ai-ready' || normalized === 'ready' || normalized === 'ai_ready') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'}`}>
        <Sparkles className={compact ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
        {!compact && 'AI Ready'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-semibold ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'}`}>
      <Upload className={compact ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
      {!compact && 'Uploaded'}
    </span>
  );
};

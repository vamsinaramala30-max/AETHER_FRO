import React from 'react';

export interface FileTypeStyleInfo {
  tag: string;
  color: string;
  bg: string;
  border: string;
  badgeBorder: string;
  badgeText: string;
  mobileBg: string;
  mobileText: string;
  mobileBorder: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export function getFileTypeInfo(mimeType: string, filename: string): FileTypeStyleInfo {
  const mime = mimeType?.toLowerCase() || '';
  const name = filename?.toLowerCase() || '';

  if (mime.includes('pdf') || name.endsWith('.pdf')) {
    return {
      tag: 'PDF',
      color: 'text-rose-500',
      bg: 'bg-[#FFF1F2] dark:bg-rose-950/30',
      border: 'border-rose-100 dark:border-rose-900/30',
      badgeBorder: 'border-rose-400 dark:border-rose-500',
      badgeText: 'text-rose-500 dark:text-rose-400',
      mobileBg: 'bg-rose-50 dark:bg-rose-950/40',
      mobileText: 'text-rose-500 dark:text-rose-400',
      mobileBorder: 'border-rose-200 dark:border-rose-800',
    };
  }

  if (mime.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(name)) {
    return {
      tag: 'IMG',
      color: 'text-teal-600',
      bg: 'bg-[#ECFDF5] dark:bg-teal-950/30',
      border: 'border-teal-100 dark:border-teal-900/30',
      badgeBorder: 'border-teal-400 dark:border-teal-500',
      badgeText: 'text-teal-600 dark:text-teal-400',
      mobileBg: 'bg-teal-50 dark:bg-teal-950/40',
      mobileText: 'text-teal-600 dark:text-teal-400',
      mobileBorder: 'border-teal-200 dark:border-teal-800',
    };
  }

  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime.includes('csv') ||
    /\.(xlsx|xls|csv|tsv)$/i.test(name)
  ) {
    return {
      tag: 'XLS',
      color: 'text-emerald-600',
      bg: 'bg-[#F0FDF4] dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      badgeBorder: 'border-emerald-400 dark:border-emerald-500',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      mobileBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      mobileText: 'text-emerald-600 dark:text-emerald-400',
      mobileBorder: 'border-emerald-200 dark:border-emerald-800',
    };
  }

  if (mime.includes('video') || /\.(mp4|webm|mov|avi|mkv|flv)$/i.test(name)) {
    return {
      tag: 'VID',
      color: 'text-purple-600',
      bg: 'bg-[#FAF5FF] dark:bg-purple-950/30',
      border: 'border-purple-100 dark:border-purple-900/30',
      badgeBorder: 'border-purple-400 dark:border-purple-500',
      badgeText: 'text-purple-600 dark:text-purple-400',
      mobileBg: 'bg-purple-50 dark:bg-purple-950/40',
      mobileText: 'text-purple-600 dark:text-purple-400',
      mobileBorder: 'border-purple-200 dark:border-purple-800',
    };
  }

  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('archive') ||
    /\.(zip|tar|gz|7z|rar|bz2)$/i.test(name)
  ) {
    return {
      tag: 'ZIP',
      color: 'text-amber-600',
      bg: 'bg-[#FFFBEB] dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/30',
      badgeBorder: 'border-amber-400 dark:border-amber-500',
      badgeText: 'text-amber-600 dark:text-amber-400',
      mobileBg: 'bg-amber-50 dark:bg-amber-950/40',
      mobileText: 'text-amber-600 dark:text-amber-400',
      mobileBorder: 'border-amber-200 dark:border-amber-800',
    };
  }

  if (mime.includes('json') || name.endsWith('.json')) {
    return {
      tag: 'JSON',
      color: 'text-blue-600',
      bg: 'bg-[#EFF6FF] dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/30',
      badgeBorder: 'border-blue-400 dark:border-blue-500',
      badgeText: 'text-blue-600 dark:text-blue-400',
      mobileBg: 'bg-blue-50 dark:bg-blue-950/40',
      mobileText: 'text-blue-600 dark:text-blue-400',
      mobileBorder: 'border-blue-200 dark:border-blue-800',
    };
  }

  if (
    name.endsWith('.md') ||
    name.endsWith('.markdown') ||
    mime.includes('text') ||
    /\.(txt|log|env|cfg|ini|toml)$/i.test(name)
  ) {
    return {
      tag: 'TXT',
      color: 'text-slate-700',
      bg: 'bg-[#F1F5F9] dark:bg-slate-800/40',
      border: 'border-slate-200/80 dark:border-slate-700/40',
      badgeBorder: 'border-slate-500 dark:border-slate-400',
      badgeText: 'text-slate-800 dark:text-slate-200',
      mobileBg: 'bg-slate-100 dark:bg-slate-800',
      mobileText: 'text-slate-700 dark:text-slate-300',
      mobileBorder: 'border-slate-300 dark:border-slate-700',
    };
  }

  if (mime.includes('word') || mime.includes('wordprocessingml') || /\.(docx|doc)$/i.test(name)) {
    return {
      tag: 'DOC',
      color: 'text-blue-600',
      bg: 'bg-[#EFF6FF] dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/30',
      badgeBorder: 'border-blue-400 dark:border-blue-500',
      badgeText: 'text-blue-600 dark:text-blue-400',
      mobileBg: 'bg-blue-50 dark:bg-blue-950/40',
      mobileText: 'text-blue-600 dark:text-blue-400',
      mobileBorder: 'border-blue-200 dark:border-blue-800',
    };
  }

  if (mime.includes('presentation') || mime.includes('powerpoint') || /\.(pptx|ppt)$/i.test(name)) {
    return {
      tag: 'PPT',
      color: 'text-orange-600',
      bg: 'bg-[#FFF7ED] dark:bg-orange-950/30',
      border: 'border-orange-100 dark:border-orange-900/30',
      badgeBorder: 'border-orange-400 dark:border-orange-500',
      badgeText: 'text-orange-600 dark:text-orange-400',
      mobileBg: 'bg-orange-50 dark:bg-orange-950/40',
      mobileText: 'text-orange-600 dark:text-orange-400',
      mobileBorder: 'border-orange-200 dark:border-orange-800',
    };
  }

  if (mime.includes('audio') || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(name)) {
    return {
      tag: 'AUD',
      color: 'text-amber-600',
      bg: 'bg-[#FFFBEB] dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/30',
      badgeBorder: 'border-amber-400 dark:border-amber-500',
      badgeText: 'text-amber-600 dark:text-amber-400',
      mobileBg: 'bg-amber-50 dark:bg-amber-950/40',
      mobileText: 'text-amber-600 dark:text-amber-400',
      mobileBorder: 'border-amber-200 dark:border-amber-800',
    };
  }

  if (/\.(ts|tsx|js|jsx|py|html|css|scss|java|go|rs|php|rb|c|cpp|h|sql|sh)$/i.test(name)) {
    return {
      tag: 'CODE',
      color: 'text-violet-600',
      bg: 'bg-[#F5F3FF] dark:bg-violet-950/30',
      border: 'border-violet-100 dark:border-violet-900/30',
      badgeBorder: 'border-violet-400 dark:border-violet-500',
      badgeText: 'text-violet-600 dark:text-violet-400',
      mobileBg: 'bg-violet-50 dark:bg-violet-950/40',
      mobileText: 'text-violet-600 dark:text-violet-400',
      mobileBorder: 'border-violet-200 dark:border-violet-800',
    };
  }

  return {
    tag: 'FILE',
    color: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    border: 'border-slate-200/60 dark:border-slate-700/60',
    badgeBorder: 'border-slate-400 dark:border-slate-500',
    badgeText: 'text-slate-600 dark:text-slate-400',
    mobileBg: 'bg-slate-50 dark:bg-slate-800',
    mobileText: 'text-slate-600 dark:text-slate-400',
    mobileBorder: 'border-slate-200 dark:border-slate-700',
  };
}

interface FileTypeIconProps {
  mimeType: string;
  filename: string;
  size?: 'sm' | 'md' | 'lg';
  previewUrl?: string;
  className?: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  mimeType,
  filename,
  size = 'md',
  previewUrl,
  className = '',
}) => {
  const info = getFileTypeInfo(mimeType, filename);
  const isImage = mimeType?.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  const sizeClasses = {
    sm: { box: 'h-10 w-full', badge: 'px-2 py-0.5 text-[10px]' },
    md: { box: 'h-28 w-full', badge: 'px-3.5 py-1.5 text-xs' },
    lg: { box: 'h-40 w-full', badge: 'px-5 py-2.5 text-base' },
  }[size];

  if (isImage && previewUrl) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${sizeClasses.box} ${className}`}>
        <img
          src={previewUrl}
          alt={filename}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border ${info.bg} ${info.border} ${sizeClasses.box} ${className}`}
    >
      <div
        className={`rounded-xl border bg-white shadow-2xs dark:bg-slate-900 ${info.badgeBorder} ${sizeClasses.badge}`}
      >
        <span className={`font-bold tracking-wider uppercase ${info.badgeText}`}>
          {info.tag}
        </span>
      </div>
    </div>
  );
};

export const FileTypeMobileBadge: React.FC<{
  mimeType: string;
  filename: string;
  className?: string;
}> = ({ mimeType, filename, className = '' }) => {
  const info = getFileTypeInfo(mimeType, filename);
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-bold text-[11px] tracking-wide ${info.mobileBg} ${info.mobileText} ${info.mobileBorder} ${className}`}
    >
      {info.tag}
    </div>
  );
};


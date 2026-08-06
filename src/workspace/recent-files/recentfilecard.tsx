import React from 'react';
import { RecentFileData } from './recentfilesservices';
import { FileCode, FileSpreadsheet, FileText } from 'lucide-react';

interface RecentFileCardProps {
  file: RecentFileData;
}

export const RecentFileCard: React.FC<RecentFileCardProps> = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'code':
        return (
          <div className="rounded-xl border border-blue-500/20 bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FileCode className="h-5 w-5" />
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <FileText className="h-5 w-5" />
          </div>
        );
    }
  };

  const timeString = new Date(file.lastAccessed).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40">
      <div className="flex min-w-0 items-center gap-3">
        {getIcon()}
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {file.name}
          </h4>
          <p className="mt-0.5 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
            {file.location}
          </p>
        </div>
      </div>

      <div className="shrink-0 space-y-0.5 text-right font-mono text-xs text-slate-500 dark:text-slate-400">
        <div>{file.sizeStr}</div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500">Opened {timeString}</div>
      </div>
    </div>
  );
};

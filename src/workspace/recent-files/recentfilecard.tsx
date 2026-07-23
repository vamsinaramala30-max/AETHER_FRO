// frontend/src/workspace/recent-files/RecentFileCard.tsx
import React from 'react';
import { RecentFileData } from './recentFilesService';

interface RecentFileCardProps {
  file: RecentFileData;
}

export const RecentFileCard: React.FC<RecentFileCardProps> = ({ file }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'code':
        return (
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V94a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };

  const timeString = new Date(file.lastAccessed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20 hover:bg-slate-800/30 transition-all flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-3 min-w-0">
        {getIcon()}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors">{file.name}</h4>
          <p className="text-xs text-slate-500 truncate font-mono mt-0.5">{file.location}</p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 font-mono text-xs text-slate-400 space-y-0.5">
        <div>{file.sizeStr}</div>
        <div className="text-[10px] text-slate-500">Opened {timeString}</div>
      </div>
    </div>
  );
};
// frontend/src/workspace/recent-files/RecentFilesPage.tsx
import React, { useState, useEffect } from 'react';
import { RecentFileCard } from './RecentFileCard';
import { recentFilesService, RecentFileData } from './recentfilesservices';

export const RecentFilesPage: React.FC = () => {
  const [files, setFiles] = useState<RecentFileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await recentFilesService.getRecentFiles();
        setFiles(data);
      } catch (err) {
        setError('Failed to mirror filesystem memory map objects.');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 min-h-screen">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Recent Workspace Blobs
        </h1>
        <p className="text-sm text-slate-400 mt-1">Instant hot-reload caching interface mapping all recently structural components.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500">MAPPING POINTER REGISTERS...</span>
        </div>
      ) : files.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-sm">
          No recently referenced memory modules available inside current context session.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map(file => (
            <RecentFileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};
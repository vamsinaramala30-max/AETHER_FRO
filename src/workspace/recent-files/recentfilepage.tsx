// frontend/src/workspace/recent-files/RecentFilesPage.tsx
import React, { useState, useEffect } from 'react';
import { RecentFileCard } from './recentfilecard';
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
      } catch {
        setError('Failed to mirror filesystem memory map objects.');
      } finally {
        setLoading(false);
      }
    };
    void fetchFiles();
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div>
        <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Recent Workspace Blobs
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Instant hot-reload caching interface mapping all recently structural components.
        </p>
      </div>

      {typeof error === 'string' && error.trim() !== '' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          <span className="font-mono text-xs text-slate-500">MAPPING POINTER REGISTERS...</span>
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-sm text-slate-500">
          No recently referenced memory modules available inside current context session.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {files.map((file) => (
            <RecentFileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

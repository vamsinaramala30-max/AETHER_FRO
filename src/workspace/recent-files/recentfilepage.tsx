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
    <div className="w-full space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Recent Workspace Files
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Instant cache interface mapping all recently accessed files and documents.
        </p>
      </div>

      {typeof error === 'string' && error.trim() !== '' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            MAPPING FILE REGISTERS...
          </span>
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No recently referenced files available in the current workspace.
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

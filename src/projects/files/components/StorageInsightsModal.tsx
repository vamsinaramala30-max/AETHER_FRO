import React from 'react';
import { X, PieChart, HardDrive, Files } from 'lucide-react';
import { StorageInsights } from '../types';

interface StorageInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: StorageInsights | null;
}

export const StorageInsightsModal: React.FC<StorageInsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
}) => {
  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getCategoryColor = (name: string) => {
    switch (name) {
      case 'Documents':
        return 'bg-blue-500';
      case 'Spreadsheets':
        return 'bg-emerald-500';
      case 'Presentations':
        return 'bg-amber-500';
      case 'PDFs':
        return 'bg-rose-500';
      case 'Images':
        return 'bg-teal-500';
      case 'Code':
        return 'bg-indigo-500';
      case 'Videos':
        return 'bg-purple-500';
      case 'Audio':
        return 'bg-yellow-500';
      case 'Archives':
        return 'bg-sky-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Workspace Storage Insights
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed category analysis of persisted files.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <HardDrive className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Storage Used</span>
              </div>
              <p className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">
                {formatSize(insights?.usedBytes ?? insights?.totalBytes ?? 0)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <HardDrive className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Capacity</span>
              </div>
              <p className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">
                {formatSize(insights?.quotaBytes || 128 * 1024 * 1024 * 1024)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <HardDrive className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Available</span>
              </div>
              <p className="mt-1.5 text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatSize(insights?.availableBytes ?? Math.max(0, (insights?.quotaBytes || 128 * 1024 * 1024 * 1024) - (insights?.totalBytes || 0)))}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Files className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Stored Files</span>
              </div>
              <p className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white">
                {(insights?.totalFiles || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Aggregate distribution bar */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Distribution by Type
            </h4>
            <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {insights?.categories
                .filter((cat) => cat.bytes > 0)
                .map((cat, i) => (
                  <div
                    key={i}
                    className={`h-full ${getCategoryColor(cat.name)} transition-all`}
                    style={{ width: `${Math.max(2, cat.percentage)}%` }}
                    title={`${cat.name}: ${formatSize(cat.bytes)} (${cat.percentage}%)`}
                  />
                ))}
            </div>
          </div>

          {/* Breakdown List */}
          <div className="mt-5 max-h-60 space-y-2 overflow-y-auto pr-1">
            {insights?.categories.map((cat, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${getCategoryColor(cat.name)}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({cat.count} {cat.count === 1 ? 'file' : 'files'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatSize(cat.bytes)}
                  </span>
                  <span className="ml-2 text-[11px] text-slate-400">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

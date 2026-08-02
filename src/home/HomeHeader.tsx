import React from 'react';
import { HomeMetaData, GlobalHomeStats } from './homeService';

interface HomeHeaderProps {
  metaData: HomeMetaData | null;
  stats: GlobalHomeStats | null;
  onRefresh?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ metaData, stats, onRefresh }) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {metaData?.greeting ?? 'Welcome'},
            <span className="text-indigo-400"> {metaData?.userDisplayName ?? 'User'}</span>
          </h1>

          <p className="mt-2 text-slate-400">{today}</p>

          <p className="mt-1 text-sm text-slate-500">
            Last Sync:{' '}
            {metaData?.lastLogin ? new Date(metaData.lastLogin).toLocaleTimeString() : 'Just now'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">Active Projects</p>
            <p className="text-xl font-bold text-white">{stats?.activeProjectsCount ?? 0}</p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">Completed Today</p>
            <p className="text-xl font-bold text-emerald-400">{stats?.completedTasksToday ?? 0}</p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">Status</p>

            <p
              className={`font-semibold ${
                metaData?.systemStatus === 'healthy'
                  ? 'text-green-400'
                  : metaData?.systemStatus === 'degraded'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {metaData?.systemStatus ?? 'Unknown'}
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;

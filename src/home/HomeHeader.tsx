import React from 'react';
import { HomeMetaData, GlobalHomeStats } from './homeService';

interface HomeHeaderProps {
  metaData: HomeMetaData | null;
  stats: GlobalHomeStats | null;
  onRefresh?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  metaData,
  stats,
  onRefresh,
}) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>
          <h1 className="text-3xl font-bold text-white">
            {metaData?.greeting ?? 'Welcome'},
            <span className="text-indigo-400">
              {' '}
              {metaData?.userDisplayName ?? 'User'}
            </span>
          </h1>

          <p className="text-slate-400 mt-2">
            {today}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Last Sync:{' '}
            {metaData?.lastLogin
              ? new Date(metaData.lastLogin).toLocaleTimeString()
              : 'Just now'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">
              Active Projects
            </p>
            <p className="text-xl font-bold text-white">
              {stats?.activeProjectsCount ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">
              Completed Today
            </p>
            <p className="text-xl font-bold text-emerald-400">
              {stats?.completedTasksToday ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 px-4 py-2">
            <p className="text-xs text-slate-400">
              Status
            </p>

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
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium"
          >
            Refresh
          </button>

        </div>

      </div>
    </header>
  );
};

export default HomeHeader;
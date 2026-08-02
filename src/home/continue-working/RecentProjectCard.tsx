import React from 'react';
import { RecentProject } from './continueWorkingService';

interface RecentProjectCardProps {
  project: RecentProject;
}

export const RecentProjectCard: React.FC<RecentProjectCardProps> = ({ project }) => {
  return (
    <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">{project.name}</h4>
          <span className="font-mono text-xs text-indigo-400">{project.repository}</span>
        </div>
        <span className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
          {project.branch}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Progress</span>
          <span>{project.completionPercentage}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
          <div
            className="h-full rounded-full bg-indigo-500"
            style={{ width: `${project.completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="text-right text-[10px] text-slate-500">Modified {project.lastModified}</div>
    </div>
  );
};

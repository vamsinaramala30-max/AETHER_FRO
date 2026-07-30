import React from 'react';
import { RecentProject } from './continueWorkingService';

interface RecentProjectCardProps {
  project: RecentProject;
}

export const RecentProjectCard: React.FC<RecentProjectCardProps> = ({ project }) => {
  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-bold text-white">{project.name}</h4>
          <span className="text-xs font-mono text-indigo-400">{project.repository}</span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
          {project.branch}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Progress</span>
          <span>{project.completionPercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${project.completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="text-[10px] text-slate-500 text-right">Modified {project.lastModified}</div>
    </div>
  );
};
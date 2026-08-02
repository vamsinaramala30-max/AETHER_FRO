import React from 'react';
import { Briefcase, Plus, Folder, Users, Star, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const ProjectsPage: React.FC = () => {
  const projects = [
    {
      id: '1',
      title: 'Aether Core Engine',
      category: 'Engineering',
      status: 'In Progress',
      progress: 78,
      members: 5,
      updatedAt: '2 hours ago',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: '2',
      title: 'AI Prompt Framework v2',
      category: 'AI Research',
      status: 'In Review',
      progress: 92,
      members: 3,
      updatedAt: '4 hours ago',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      id: '3',
      title: 'Mobile App Redesign',
      category: 'UI/UX Design',
      status: 'Planning',
      progress: 35,
      members: 4,
      updatedAt: 'Yesterday',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Projects Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track, manage, and collaborate across all active workspace initiatives.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Projects
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Avg Completion
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">68%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Collaborators
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">24</p>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${project.color} flex items-center justify-center text-sm font-bold text-white shadow-sm`}
                >
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {project.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="p-1 text-slate-400 transition-colors hover:text-amber-500"
              >
                <Star className="h-4 w-4" />
              </button>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Progress</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{project.updatedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

import React from 'react';
import { Briefcase, Plus, Folder, Calendar, Users, Star, Clock } from 'lucide-react';

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
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: '2',
      title: 'AI Prompt Framework v2',
      category: 'AI Research',
      status: 'In Review',
      progress: 92,
      members: 3,
      updatedAt: '4 hours ago',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: '3',
      title: 'Mobile App Redesign',
      category: 'UI/UX Design',
      status: 'Planning',
      progress: 35,
      members: 4,
      updatedAt: 'Yesterday',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#192032] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Projects Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track, manage, and collaborate across all active workspace initiatives.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-900/30 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 hover:border-purple-500/40 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${project.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base leading-snug">{project.title}</h3>
                  <span className="text-xs text-slate-400">{project.category}</span>
                </div>
              </div>
              <button type="button" className="text-slate-500 hover:text-amber-400 transition-colors">
                <Star className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span>Progress</span>
                <span className="text-purple-400 font-semibold">{project.progress}%</span>
              </div>
              <div className="w-full bg-[#161C2E] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#192032]/80">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{project.updatedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Plus, Folder, Users, Star, Clock, AlertCircle, X } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '../api/client';

interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  progress?: number;
  membersCount?: number;
  updatedAt: string;
}

interface ProjectStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  avgCompletion: number;
  totalCollaborators: number;
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    avgCompletion: 0,
    totalCollaborators: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDesc, setNewProjectDesc] = useState<string>('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<any>('/projects');
      const payload = data?.data || data;
      const rawProjects = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.projects)
        ? payload.projects
        : Array.isArray(payload?.recentProjects)
        ? payload.recentProjects
        : [];

      if (Array.isArray(rawProjects)) {
        const mapped = rawProjects.map((p: any) => ({
          id: p.id || `proj-${Date.now()}`,
          name: p.name || 'Untitled Project',
          description: p.description || '',
          category: p.category || 'General',
          progress: p.progress ?? 0,
          membersCount: p.membersCount || 1,
          updatedAt: new Date(p.updatedAt || Date.now()).toLocaleDateString(),
        }));
        setProjects(mapped);

        if (payload?.stats) {
          const s = payload.stats;
          setStats({
            totalProjects: s.totalProjects ?? mapped.length,
            totalTasks: s.totalTasks ?? 0,
            completedTasks: s.completedTasks ?? 0,
            avgCompletion: s.totalTasks ? Math.round((s.completedTasks / s.totalTasks) * 100) : 0,
            totalCollaborators: s.totalCollaborators ?? (mapped.length > 0 ? 1 : 0),
          });
        } else {
          setStats({
            totalProjects: mapped.length,
            totalTasks: 0,
            completedTasks: 0,
            avgCompletion: 0,
            totalCollaborators: mapped.length > 0 ? 1 : 0,
          });
        }
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await apiClient.post<any>('/projects', {
        name: newProjectName,
        description: newProjectDesc,
      });
      const created = res.data || res;
      const newProj: Project = {
        id: created.id || `proj-${Date.now()}`,
        name: created.name || newProjectName,
        description: created.description || newProjectDesc || 'Workspace Initiative',
        category: 'General',
        progress: 0,
        membersCount: 1,
        updatedAt: new Date().toLocaleDateString(),
      };
      setProjects((prev) => [newProj, ...prev]);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
    } catch {
      const fallbackProj: Project = {
        id: `proj-${Date.now()}`,
        name: newProjectName,
        description: newProjectDesc || 'Workspace Initiative',
        category: 'General',
        progress: 0,
        membersCount: 1,
        updatedAt: new Date().toLocaleDateString(),
      };
      setProjects((prev) => [fallbackProj, ...prev]);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="h-7 w-7 text-purple-600 dark:text-purple-400 shrink-0" />
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
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Projects
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {projects.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Avg Completion
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.avgCompletion}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Collaborators
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.totalCollaborators}
          </p>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {loading ? (
        <div className="flex h-48 w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
          <Folder className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No projects created yet
          </p>
          <p className="text-xs text-slate-400">
            Click "New Project" to launch your first workspace initiative.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-500/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                    <Folder className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {project.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {project.description}
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
                  <span>{project.membersCount} members</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{project.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aether Core Engine"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  placeholder="Project goals and scope..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreateProject()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

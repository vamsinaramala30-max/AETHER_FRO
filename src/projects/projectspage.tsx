import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Folder,
  Users,
  Clock,
  AlertCircle,
  X,
  Trash2,
  CheckSquare,
  Target,
  FileText,
  Activity,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '../api/client';
import { useNotificationStore } from '@/state/notificationStore';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  progress?: number;
  membersCount?: number;
  createdAt?: string;
  updatedAt: string;
}

interface ProjectSummaryStats {
  totalTasks: number;
  todo: number;
  inExecution: number;
  review: number;
  done: number;
  overdue: number;
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  goalProgress: number;
  totalFiles: number;
}

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<ProjectSummaryStats>({
    totalTasks: 0,
    todo: 0,
    inExecution: 0,
    review: 0,
    done: 0,
    overdue: 0,
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    goalProgress: 0,
    totalFiles: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDesc, setNewProjectDesc] = useState<string>('');
  const [newProjectCategory, setNewProjectCategory] = useState<string>('Engineering');

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projRes, tasksRes, goalsRes, filesRes] = await Promise.allSettled([
        apiClient.get<any>('/projects'),
        apiClient.get<any>('/tasks'),
        apiClient.get<any>('/goals'),
        apiClient.get<any>('/uploads?limit=100'),
      ]);

      let rawProjects: any[] = [];
      if (projRes.status === 'fulfilled') {
        const payload = projRes.value?.data || projRes.value;
        rawProjects = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.projects)
            ? payload.projects
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
      } else {
        setError(projRes.reason?.message || 'Failed to load projects from server.');
      }

      const mappedProjects: Project[] = rawProjects.map((p: any) => ({
        id: p.id || `proj-${Date.now()}`,
        name: p.name || 'Untitled Project',
        description: p.description || 'Workspace Initiative',
        category: p.category || 'General',
        status: p.status || 'ACTIVE',
        progress: p.progressPercentage ?? p.progress ?? 0,
        membersCount: p.membersCount || 1,
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : undefined,
        updatedAt: new Date(p.updatedAt || Date.now()).toLocaleDateString(),
      }));

      setProjects(mappedProjects);

      // Task metrics computation
      let rawTasks: any[] = [];
      if (tasksRes.status === 'fulfilled') {
        const tVal = tasksRes.value?.data || tasksRes.value;
        rawTasks = Array.isArray(tVal) ? tVal : Array.isArray(tVal?.data) ? tVal.data : [];
      }

      const todayStr = new Date().toISOString().split('T')[0];
      let todo = 0,
        inExecution = 0,
        review = 0,
        done = 0,
        overdue = 0;

      rawTasks.forEach((t: any) => {
        const s = (t.status || '').toLowerCase();
        if (s.includes('done') || s.includes('completed')) done++;
        else if (s.includes('review')) review++;
        else if (s.includes('progress') || s.includes('execution')) inExecution++;
        else todo++;

        if (t.dueDate && t.dueDate < todayStr && !s.includes('done')) overdue++;
      });

      // Goal metrics computation
      let rawGoals: any[] = [];
      if (goalsRes.status === 'fulfilled') {
        const gVal = goalsRes.value?.data || goalsRes.value;
        rawGoals = Array.isArray(gVal) ? gVal : Array.isArray(gVal?.data) ? gVal.data : [];
      }

      let activeGoals = 0,
        completedGoals = 0,
        totalProgressSum = 0;
      rawGoals.forEach((g: any) => {
        const p = g.progress ?? 0;
        totalProgressSum += p;
        if (g.status === 'COMPLETED' || p >= 100) completedGoals++;
        else activeGoals++;
      });

      // File metrics computation
      let totalFiles = 0;
      if (filesRes.status === 'fulfilled') {
        const fVal = filesRes.value?.data || filesRes.value;
        const rawFiles = Array.isArray(fVal) ? fVal : fVal?.files || fVal?.data || [];
        totalFiles = rawFiles.length;
      }

      setSummary({
        totalTasks: rawTasks.length,
        todo,
        inExecution,
        review,
        done,
        overdue,
        totalGoals: rawGoals.length,
        activeGoals,
        completedGoals,
        goalProgress: rawGoals.length > 0 ? Math.round(totalProgressSum / rawGoals.length) : 0,
        totalFiles,
      });
    } catch {
      setError('Could not pull workspace intelligence data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjectData();
  }, [fetchProjectData]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await apiClient.post<any>('/projects', {
        name: newProjectName,
        description: newProjectDesc,
        category: newProjectCategory,
      });
      const created = res.data || res;
      const newProj: Project = {
        id: created.id || `proj-${Date.now()}`,
        name: created.name || newProjectName,
        description: created.description || newProjectDesc || 'Workspace Initiative',
        category: created.category || newProjectCategory,
        status: 'ACTIVE',
        progress: 0,
        membersCount: 1,
        updatedAt: new Date().toLocaleDateString(),
      };
      setProjects((prev) => [newProj, ...prev]);
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      useNotificationStore.getState().addNotification({
        title: 'Project Initialized',
        description: `Project "${newProj.name}" created and saved.`,
        type: 'project',
      });
    } catch {
      useNotificationStore.getState().addNotification({
        title: 'Creation Failed',
        description: 'Unable to commit new project to backend.',
        type: 'project',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
      useNotificationStore.getState().addNotification({
        title: 'Project Deleted',
        description: 'Project and associated metadata removed.',
        type: 'project',
      });
    } catch (err: any) {
      setDeleteTarget(null);
      useNotificationStore.getState().addNotification({
        title: 'Deletion Failed',
        description: err?.message || 'Unable to delete project from server.',
        type: 'project',
      });
    }
  };

  // Determine Project Health indicator based on real signals
  const healthSignal = useMemo(() => {
    if (
      summary.overdue >= 3 ||
      (summary.totalTasks > 0 && summary.done / summary.totalTasks < 0.2)
    ) {
      return {
        badge: 'CRITICAL',
        color: 'bg-rose-500 text-white',
        border: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
        insight: `${summary.overdue} tasks are overdue and completion rate requires attention.`,
      };
    }
    if (summary.overdue > 0 || summary.activeGoals > summary.completedGoals * 2) {
      return {
        badge: 'AT RISK',
        color: 'bg-amber-500 text-white',
        border: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        insight: `${summary.overdue} task is overdue and active milestone goals are approaching target dates.`,
      };
    }
    return {
      badge: 'HEALTHY',
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      insight: 'All tasks and milestone goals are progressing efficiently according to schedule.',
    };
  }, [summary]);

  return (
    <PageWrapper wide>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="h-7 w-7 shrink-0 text-purple-600 dark:text-purple-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Projects Command Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Centralized project intelligence, workload breakdown, and milestone progress tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => void fetchProjectData()}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs text-white hover:bg-rose-500 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Project Health & Quick Command Bar */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm ${healthSignal.border}`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Project Health
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider ${healthSignal.color}`}
            >
              {healthSignal.badge}
            </span>
          </div>
          <p className="mt-3 text-xs font-medium leading-relaxed">{healthSignal.insight}</p>
        </div>

        {/* Quick Actions Panel */}
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Command Actions
          </span>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/app/projects/tasks')}
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
            >
              <CheckSquare className="h-4 w-4" />+ New Task
            </button>
            <button
              onClick={() => navigate('/app/projects/goals')}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
            >
              <Target className="h-4 w-4" />+ New Goal
            </button>
            <button
              onClick={() => navigate('/app/projects/files')}
              className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/70 px-4 py-2.5 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20"
            >
              <FileText className="h-4 w-4" />
              Upload File
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Dashboard */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Task Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Total Tasks
            </span>
            <CheckSquare className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.totalTasks}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              TODO: {summary.todo}
            </span>
            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              EXEC: {summary.inExecution}
            </span>
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              REV: {summary.review}
            </span>
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              DONE: {summary.done}
            </span>
            {summary.overdue > 0 && (
              <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                OVERDUE: {summary.overdue}
              </span>
            )}
          </div>
        </div>

        {/* Goal Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Macro Goals
            </span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.totalGoals}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>Active: {summary.activeGoals}</span>
            <span>Completed: {summary.completedGoals}</span>
          </div>
        </div>

        {/* Goal Progress Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Goal Completion Rate
            </span>
            <Activity className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            {summary.goalProgress}%
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-purple-600 transition-all duration-500"
              style={{ width: `${summary.goalProgress}%` }}
            />
          </div>
        </div>

        {/* Files Count Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Workspace Assets
            </span>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.totalFiles}
          </p>
          <p className="mt-3 text-[11px] font-medium text-slate-400">Production files uploaded</p>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Projects</h2>
          <span className="text-xs text-slate-500">{projects.length} Initiatives</span>
        </div>

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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-500/40"
              >
                <div className="flex items-start justify-between gap-3">
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
                    onClick={() => setDeleteTarget(project)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
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
                    <span>{project.membersCount} member</span>
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
      </div>

      {/* Delete Project Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Project?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This will permanently delete the project "{deleteTarget.name}" and its
                  project-specific data.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDeleteProject(deleteTarget.id)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
              >
                Delete Project
              </button>
            </div>
          </div>
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
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering / Product"
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
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

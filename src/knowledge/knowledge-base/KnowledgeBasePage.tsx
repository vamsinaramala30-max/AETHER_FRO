import React, { useState, useEffect, useCallback } from 'react';
import { KnowledgeNode } from '../types';
import { KnowledgeGraph } from './knowledgegraph';
import { KnowledgeDateGraph, DateActivityItem } from './KnowledgeDateGraph';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  Database,
  FileText,
  FolderOpen,
  BookOpen,
  Layers,
  CheckSquare,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { apiClient } from '@/api/client';
import { useNavigate } from 'react-router-dom';
import { onActivityUpdate } from '@/shared/activityEvents';

export interface KnowledgeStats {
  totalKnowledge: number;
  files: number;
  documents: number;
  notes: number;
  connectedProjects: number;
  connectedTasks: number;
  automations: number;
}

export const KnowledgeBasePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [activity, setActivity] = useState<DateActivityItem[]>([]);
  const [gaps, setGaps] = useState<Array<{ projectId: string; projectName: string; message: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, graphRes, actRes, gapsRes] = await Promise.all([
        apiClient.get<any>('/knowledge/stats').catch(() => null),
        apiClient.get<any>('/knowledge/graph').catch(() => null),
        apiClient.get<any>('/knowledge/activity').catch(() => null),
        apiClient.get<any>('/knowledge/gaps').catch(() => null),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      else if (statsRes?.totalKnowledge !== undefined) setStats(statsRes);

      if (graphRes?.nodes && Array.isArray(graphRes.nodes)) setNodes(graphRes.nodes);
      else if (Array.isArray(graphRes?.data)) setNodes(graphRes.data);

      if (actRes?.activity && Array.isArray(actRes.activity)) setActivity(actRes.activity);

      if (gapsRes?.gaps && Array.isArray(gapsRes.gaps)) setGaps(gapsRes.gaps);
    } catch {
      setStats(null);
      setNodes([]);
      setActivity([]);
      setGaps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
    const unsubscribe = onActivityUpdate(() => {
      void loadData();
    });
    return unsubscribe;
  }, [loadData]);

  const isEmptyState = !stats || stats.totalKnowledge === 0;

  return (
    <PageWrapper wide>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Database className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AETHER Knowledge Intelligence Base
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real relational intelligence view connecting Files, Documents, Notes, Projects, and Automations.
            </p>
          </div>
        </div>

        {/* Add to Knowledge Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Knowledge</span>
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 top-12 z-40 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  navigate('/app/knowledge/notes');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-400"
              >
                <BookOpen className="h-4 w-4 text-amber-500" />
                <span>Create Note</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  navigate('/app/knowledge/documents');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
              >
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Create Document</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  navigate('/app/projects/files');
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400"
              >
                <FolderOpen className="h-4 w-4 text-purple-500" />
                <span>Attach Existing File</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-xs font-semibold text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400">
          <span className="animate-pulse">Loading live knowledge database metrics...</span>
        </div>
      ) : isEmptyState ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Database className="mb-4 h-12 w-12 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No knowledge data yet</h3>
          <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
            Add files, documents or notes to start building your AETHER knowledge base.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/app/projects/files')}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-500"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Upload Workspace Files</span>
            </button>
            <button
              onClick={() => navigate('/app/knowledge/documents')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
            >
              <FileText className="h-4 w-4" />
              <span>Create Document</span>
            </button>
            <button
              onClick={() => navigate('/app/knowledge/notes')}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-500"
            >
              <BookOpen className="h-4 w-4" />
              <span>Create Note</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* REAL STATISTICS CARDS */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Knowledge</span>
                <Database className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.totalKnowledge || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Files</span>
                <FolderOpen className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.files || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Documents</span>
                <FileText className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.documents || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Notes</span>
                <BookOpen className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.notes || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Projects</span>
                <Layers className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.connectedProjects || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-pink-600 dark:text-pink-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tasks</span>
                <CheckSquare className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {stats?.connectedTasks || 0}
              </p>
            </div>
          </div>

          {/* KNOWLEDGE GAPS WARNING BANNERS */}
          {gaps.length > 0 && (
            <div className="space-y-3">
              {gaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 dark:border-amber-500/20 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Knowledge gap detected
                      </h4>
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                        {gap.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/app/knowledge/documents')}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500"
                  >
                    <span>+ Add Knowledge</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* REAL RELATIONAL GRAPH */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Relational Topology Graph
            </h2>
            <KnowledgeGraph nodes={nodes} />
          </div>

          {/* REAL DATE ACTIVITY GRAPH */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Knowledge Event Timeline
            </h2>
            <KnowledgeDateGraph activityData={activity} />
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

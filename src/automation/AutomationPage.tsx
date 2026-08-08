import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  Zap,
  Plus,
  Play,
  Pause,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'failed';
  trigger: string;
  lastRun: string;
  runs: number;
  successRate: number;
}

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    icon: CheckCircle,
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20',
    icon: Pause,
  },
  failed: {
    label: 'Failed',
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20',
    icon: XCircle,
  },
};

export const AutomationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: 'Schedule · Daily',
  });

  const toggleWorkflow = (id: string) =>
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id && w.status !== 'failed'
          ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
          : w,
      ),
    );

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflow.name.trim()) return;

    const created: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWorkflow.name.trim(),
      description: newWorkflow.description.trim() || 'Automated task sequence.',
      status: 'active',
      trigger: newWorkflow.trigger,
      lastRun: 'Just now',
      runs: 0,
      successRate: 100,
    };

    setWorkflows((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewWorkflow({ name: '', description: '', trigger: 'Schedule · Daily' });
  };

  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);
  const activeCount = workflows.filter((w) => w.status === 'active').length;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Zap className="h-7 w-7 shrink-0 text-amber-500 dark:text-amber-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Automation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Workflows, triggers, integrations, and schedules
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      </div>

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create Automation Workflow
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Follow-up Routine"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize what this automation pipeline does..."
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Trigger Event
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule · 9:00 AM or On document upload"
                  value={newWorkflow.trigger}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Workflows
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Executions
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalRuns}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Avg Success Rate
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {Math.round(workflows.reduce((s, w) => s + w.successRate, 0) / workflows.length)}%
          </p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['Workflows', 'Integrations', 'Schedules', 'Logs'].map((tab, i) => (
          <Link
            key={tab}
            to={
              i === 0
                ? '/app/automation/workflows'
                : i === 1
                  ? '/app/automation/integrations'
                  : i === 2
                    ? '/app/automation/schedules'
                    : '/app/automation/logs'
            }
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              i === 0
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {/* Workflows List */}
      <div className="space-y-3">
        {workflows.map((workflow) => {
          const status = STATUS_CONFIG[workflow.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={workflow.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {workflow.name}
                    </h3>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${status.bg} ${status.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {workflow.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {workflow.trigger}
                    </span>
                    <span className="font-semibold">{workflow.runs} runs</span>
                    <span
                      className={`font-bold ${
                        workflow.successRate >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : workflow.successRate >= 70
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {workflow.successRate}% success
                    </span>
                    <span>Last: {workflow.lastRun}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {workflow.status !== 'failed' && (
                    <button
                      type="button"
                      onClick={() => toggleWorkflow(workflow.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {workflow.status === 'active' ? (
                        <>
                          <Pause className="h-3.5 w-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Resume
                        </>
                      )}
                    </button>
                  )}
                  {workflow.status === 'failed' && (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> View Error
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default AutomationPage;

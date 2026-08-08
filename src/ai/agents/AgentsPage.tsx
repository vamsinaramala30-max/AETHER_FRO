import React, { useState } from 'react';
import { Activity, Plus, Settings, Trash2, Play, Pause, BookOpen, X, Sparkles } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  knowledgeSources: number;
  executions: number;
  lastRun: string;
  tools: string[];
}

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20',
    dot: 'bg-amber-500',
  },
  error: {
    label: 'Error',
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20',
    dot: 'bg-rose-500',
  },
};

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    toolsStr: 'Web Search, Knowledge Base',
  });

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a,
      ),
    );
  };

  const deleteAgent = (id: string) => {
    if (confirm('Delete this agent permanently?')) {
      setAgents((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name.trim()) return;

    const toolsList = newAgent.toolsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const created: Agent = {
      id: `agent-${Date.now()}`,
      name: newAgent.name.trim(),
      description: newAgent.description.trim() || 'Custom autonomous agent capability.',
      status: 'active',
      knowledgeSources: 1,
      executions: 0,
      lastRun: 'Just now',
      tools: toolsList.length > 0 ? toolsList : ['Custom Tool'],
    };

    setAgents((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewAgent({ name: '', description: '', toolsStr: 'Web Search, Knowledge Base' });
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Activity className="h-7 w-7 shrink-0 text-pink-600 dark:text-pink-400" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Agents
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Autonomous AI agents with custom capabilities & integrations
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Agent
        </button>
      </div>

      {/* Modal Dialog for New Agent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Configure New AI Agent
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Agent Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Prospecting Agent"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Capability Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what tasks this agent autonomously executes..."
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enabled Tools (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Web Search, Knowledge Base, Code Analysis"
                  value={newAgent.toolsStr}
                  onChange={(e) => setNewAgent({ ...newAgent, toolsStr: e.target.value })}
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
                  Create & Deploy Agent
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
            Total Agents
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{agents.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {agents.filter((a) => a.status === 'active').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Runs
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {agents.reduce((sum, a) => sum + a.executions, 0)}
          </p>
        </div>
      </div>

      {/* Agents List */}
      {agents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <Activity className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            No agents configured
          </p>
          <p className="mb-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
            Create your first autonomous agent to automate tasks
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => {
            const status = STATUS_CONFIG[agent.status];
            return (
              <div
                key={agent.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {agent.name}
                      </h3>
                      <span
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${status.bg} ${status.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {agent.description}
                    </p>

                    {/* Tools */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {agent.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-lg border border-slate-200 bg-slate-100/70 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        {agent.knowledgeSources} sources
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Activity className="h-3.5 w-3.5 text-emerald-500" />
                        {agent.executions} runs
                      </span>
                      <span className="font-medium text-slate-400">Last run: {agent.lastRun}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        agent.status === 'active'
                          ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
                          : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                      }`}
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="h-3.5 w-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Configuring parameters for agent "${agent.name}"`)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAgent(agent.id)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
};

export default AgentsPage;

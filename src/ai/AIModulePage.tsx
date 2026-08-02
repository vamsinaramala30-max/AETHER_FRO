import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Brain, Sparkles, Cpu, Activity } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

const AI_MODULES = [
  {
    href: '/app/ai/assistant',
    icon: MessageSquare,
    label: 'Assistant',
    description: 'Chat with your AI assistant. Search & manage past conversations.',
    color:
      'from-purple-500/10 via-indigo-500/10 to-transparent dark:from-purple-600/20 dark:to-indigo-600/20',
    border: 'border-purple-200 dark:border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    href: '/app/ai/memory',
    icon: Brain,
    label: 'Memory',
    description: 'Manage what your AI remembers about you.',
    color:
      'from-cyan-500/10 via-teal-500/10 to-transparent dark:from-cyan-600/20 dark:to-teal-600/20',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    href: '/app/ai/prompts',
    icon: Sparkles,
    label: 'Prompt Library',
    description: 'Reusable prompts, templates and variables.',
    color:
      'from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-600/20 dark:to-orange-600/20',
    border: 'border-amber-200 dark:border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    href: '/app/ai/models',
    icon: Cpu,
    label: 'Models',
    description: 'Configure AI providers and model preferences.',
    color:
      'from-emerald-500/10 via-green-500/10 to-transparent dark:from-emerald-600/20 dark:to-green-600/20',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    href: '/app/ai/agents',
    icon: Activity,
    label: 'Agents',
    description: 'Autonomous agents with custom knowledge and tools.',
    color:
      'from-pink-500/10 via-rose-500/10 to-transparent dark:from-pink-600/20 dark:to-rose-600/20',
    border: 'border-pink-200 dark:border-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
];

export const AIModulePage: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your intelligent workspace assistant & agents engine
            </p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              to={mod.href}
              className={`group flex flex-col gap-4 rounded-2xl bg-white bg-gradient-to-br p-5 dark:bg-slate-900 ${mod.color} border ${mod.border} shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 ${mod.iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {mod.label}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {mod.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Start: jump directly to assistant */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white p-6 shadow-sm dark:border-purple-500/20 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-slate-900 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Start a new conversation
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Ask anything — your AI Assistant is ready with full history management.
          </p>
        </div>
        <Link
          to="/app/ai/assistant"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25"
        >
          <MessageSquare className="h-4 w-4" />
          Open Assistant
        </Link>
      </div>
    </PageWrapper>
  );
};

export default AIModulePage;

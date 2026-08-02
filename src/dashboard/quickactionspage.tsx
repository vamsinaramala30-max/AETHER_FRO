import React from 'react';
import { Zap, FileText, CheckSquare, Bot, Search } from 'lucide-react';

export const QuickActionsPage: React.FC = () => {
  const actions = [
    {
      title: 'Create New Task',
      desc: 'Add a new item to your task backlog',
      icon: <CheckSquare className="h-5 w-5 text-emerald-400" />,
    },
    {
      title: 'Start AI Session',
      desc: 'Launch interactive AI assistant prompt',
      icon: <Bot className="h-5 w-5 text-purple-400" />,
    },
    {
      title: 'Create Note',
      desc: 'Capture quick ideas or meeting notes',
      icon: <FileText className="h-5 w-5 text-blue-400" />,
    },
    {
      title: 'Global Search',
      desc: 'Search documents, files, and messages',
      icon: <Search className="h-5 w-5 text-amber-400" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
          <Zap className="h-6 w-6 text-amber-400" />
          Quick Actions & Shortcuts
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Fast triggers for common workflows and productivity operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-[#192032] bg-[#0D121F] p-5 transition-all hover:border-amber-500/40"
          >
            <div className="rounded-xl border border-[#1E2638] bg-[#141B2D] p-3 transition-transform group-hover:scale-105">
              {act.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white transition-colors group-hover:text-amber-400">
                {act.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

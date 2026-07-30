import React from 'react';
import { Zap, Plus, Bot, FileText, CheckSquare, Search, Sparkles } from 'lucide-react';

export const QuickActionsPage: React.FC = () => {
  const actions = [
    { title: 'Create New Task', desc: 'Add a new item to your task backlog', icon: <CheckSquare className="w-5 h-5 text-emerald-400" /> },
    { title: 'Start AI Session', desc: 'Launch interactive AI assistant prompt', icon: <Bot className="w-5 h-5 text-purple-400" /> },
    { title: 'Create Note', desc: 'Capture quick ideas or meeting notes', icon: <FileText className="w-5 h-5 text-blue-400" /> },
    { title: 'Global Search', desc: 'Search documents, files, and messages', icon: <Search className="w-5 h-5 text-amber-400" /> },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Zap className="w-6 h-6 text-amber-400" />
          Quick Actions & Shortcuts
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Fast triggers for common workflows and productivity operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="bg-[#0D121F] border border-[#192032] hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all flex items-center gap-4 group"
          >
            <div className="p-3 rounded-xl bg-[#141B2D] border border-[#1E2638] group-hover:scale-105 transition-transform">
              {act.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base group-hover:text-amber-400 transition-colors">
                {act.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

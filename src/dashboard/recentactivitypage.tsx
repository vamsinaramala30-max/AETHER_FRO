import React from 'react';
import { Activity, GitCommit, FileText, CheckCircle, MessageSquare } from 'lucide-react';

export const RecentActivityPage: React.FC = () => {
  const activities = [
    {
      icon: <GitCommit className="w-4 h-4 text-purple-400" />,
      title: 'Pushed 4 commits to feature/analytics-dashboard',
      time: '15 minutes ago',
      user: 'You',
    },
    {
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      title: 'Updated document "System Architecture Specs v2"',
      time: '1 hour ago',
      user: 'Alex Rivera',
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      title: 'Completed task "Set up OAuth2 authentication backend"',
      time: '3 hours ago',
      user: 'You',
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
      title: 'Commented on goal "Reach 99.9% Uptime SLA"',
      time: '5 hours ago',
      user: 'DevOps Bot',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-purple-400" />
          Recent Activity Log
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time audit log of workspace events, updates, and contributions.
        </p>
      </div>

      <div className="bg-[#0D121F] border border-[#192032] rounded-2xl p-5 divide-y divide-[#192032]">
        {activities.map((act, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#141B2D] border border-[#1E2638] shrink-0 mt-0.5">{act.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-200">{act.title}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>By {act.user}</span>
                <span>•</span>
                <span>{act.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

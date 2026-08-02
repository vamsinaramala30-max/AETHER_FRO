import React from 'react';
import { Activity, GitCommit, FileText, CheckCircle, MessageSquare } from 'lucide-react';

export const RecentActivityPage: React.FC = () => {
  const activities = [
    {
      icon: <GitCommit className="h-4 w-4 text-purple-400" />,
      title: 'Pushed 4 commits to feature/analytics-dashboard',
      time: '15 minutes ago',
      user: 'You',
    },
    {
      icon: <FileText className="h-4 w-4 text-blue-400" />,
      title: 'Updated document "System Architecture Specs v2"',
      time: '1 hour ago',
      user: 'Alex Rivera',
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
      title: 'Completed task "Set up OAuth2 authentication backend"',
      time: '3 hours ago',
      user: 'You',
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-amber-400" />,
      title: 'Commented on goal "Reach 99.9% Uptime SLA"',
      time: '5 hours ago',
      user: 'DevOps Bot',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="border-b border-[#192032] pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
          <Activity className="h-6 w-6 text-purple-400" />
          Recent Activity Log
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time audit log of workspace events, updates, and contributions.
        </p>
      </div>

      <div className="divide-y divide-[#192032] rounded-2xl border border-[#192032] bg-[#0D121F] p-5">
        {activities.map((act, idx) => (
          <div key={idx} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="mt-0.5 shrink-0 rounded-lg border border-[#1E2638] bg-[#141B2D] p-2">
              {act.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-200">{act.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
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

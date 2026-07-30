import React, { useEffect, useState } from 'react';
import { ContinueWorkingData, fetchContinueWorkingData } from './continueWorkingService';
import { RecentProjectCard } from './RecentProjectCard';
import { RecentConversationCard } from './RecentConversationCard';

export const ContinueWorking: React.FC = () => {
  const [data, setData] = useState<ContinueWorkingData | null>(null);

  useEffect(() => {
    fetchContinueWorkingData().then(setData);
  }, []);

  if (!data) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-base font-bold text-white">Continue Working</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Active Repositories</span>
          {data.projects.map((proj) => (
            <RecentProjectCard key={proj.id} project={proj} />
          ))}
        </div>
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Recent Discussions</span>
          {data.conversations.map((conv) => (
            <RecentConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      </div>
    </section>
  );
};
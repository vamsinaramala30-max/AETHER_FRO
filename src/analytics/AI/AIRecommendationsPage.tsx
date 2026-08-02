import React from 'react';
import { AIAnalyticsSummary } from './aiAnalyticsService';
import { WeeklyPicks } from './WeeklyPicks';
import { FreshAngles } from './FreshAngles';
import { Optimize } from './Optimize';
import { Direction } from './Direction';

interface AIRecommendationsPageProps {
  data?: AIAnalyticsSummary;
  isLoading?: boolean;
}

export const AIRecommendationsPage: React.FC<AIRecommendationsPageProps> = ({
  data,
  isLoading = false,
}) => {
  const handleApply = (id: string) => {
    alert(`Applied AI recommendation ID: ${id}`);
  };

  if (isLoading || !data) {
    return (
      <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-40 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
          <div className="h-40 rounded-lg bg-slate-100 dark:bg-slate-700/50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WeeklyPicks items={data.weeklyPicks} onApply={handleApply} />
      <FreshAngles items={data.freshAngles} onApply={handleApply} />
      <Optimize items={data.optimize} onApply={handleApply} />
      <Direction items={data.direction} onApply={handleApply} />
    </div>
  );
};

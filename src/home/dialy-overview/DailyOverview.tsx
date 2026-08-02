import React, { useEffect, useState } from 'react';
import { OverviewMetric, fetchDailyOverviewMetrics } from './dailyOverviewService';
import { OverviewCard } from './OverviewCard';

export const DailyOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<OverviewMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDailyOverviewMetrics()
      .then(setMetrics)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-xl bg-slate-800/40" />;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold tracking-wide text-white">Daily Performance Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <OverviewCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
};

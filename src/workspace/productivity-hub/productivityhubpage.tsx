import React, { useState, useEffect } from 'react';
import { ProductivityStats } from './productivitystats';
import { ProductivityChart } from './productivitychart';
import  FocusTimer from './Focustimer';
import { productivityService, ProductivityStatsData, ChartDataPoint } from './productivityservice';

export const ProductivityHubPage: React.FC = () => {
  const [stats, setStats] = useState<ProductivityStatsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHubData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedStats, fetchedHistory] = await Promise.all([
        productivityService.getStats(),
        productivityService.getHistory(),
      ]);
      setStats(fetchedStats);
      setChartData(fetchedHistory);
    } catch {
      setError('Failed to instantiate analytical core telemetry models.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHubData();
  }, [fetchHubData]);

  const handleSessionComplete = (minutes: number) => {
    void (async () => {
      try {
        const updatedStats = await productivityService.logFocusSession(minutes);
        setStats(updatedStats);
      } catch {
        console.error('Telemetry error updating local cache matrix');
      }
    })();
  };

  return (
    <div className="w-full space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Productivity Telemetry Control
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor attention limits, focus session loops, and workspace block efficiency metrics.
        </p>
      </div>

      {typeof error === 'string' && error.trim() !== '' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {loading || !stats ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            POLLING PERFORMANCE REGISTERS...
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          <ProductivityStats stats={stats} />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProductivityChart data={chartData} />
            </div>
            <div>
              <FocusTimer onSessionComplete={handleSessionComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// frontend/src/workspace/productivity-hub/ProductivityHubPage.tsx
import React, { useState, useEffect } from 'react';
import { ProductivityStats } from './ProductivityStats';
import { ProductivityChart } from './ProductivityChart';
import { FocusTimer } from './FocusTimer';
import { productivityService, ProductivityStatsData, ChartDataPoint } from './productivityService';

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
    <div className="mx-auto min-h-screen w-full max-w-7xl space-y-6 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div>
        <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Productivity Telemetry Control
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor attention engineering limits, focus loops, and system block efficiency metrics.
        </p>
      </div>

      {typeof error === 'string' && error.trim() !== '' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading || !stats ? (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="font-mono text-xs text-slate-500">POLLING PERFORMANCE REGISTERS...</span>
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

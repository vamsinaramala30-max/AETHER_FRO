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
        productivityService.getHistory()
      ]);
      setStats(fetchedStats);
      setChartData(fetchedHistory);
    } catch (err) {
      setError('Failed to instantiate analytical core telemetry models.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHubData();
  }, [fetchHubData]);

  const handleSessionComplete = async (minutes: number) => {
    try {
      const updatedStats = await productivityService.logFocusSession(minutes);
      setStats(updatedStats);
    } catch (err) {
      console.error('Telemetry error updating local cache matrix');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 min-h-screen">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Productivity Telemetry Control
        </h1>
        <p className="text-sm text-slate-400 mt-1">Monitor attention engineering limits, focus loops, and system block efficiency metrics.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {loading || !stats ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-500">POLLING PERFORMANCE REGISTERS...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <ProductivityStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
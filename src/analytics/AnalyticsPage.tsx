import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilters } from './AnalyticsFilters';
import { DateRange, fetchOverviewMetrics, exportAnalyticsData } from './analyticsService';

import { ProductivityReportPage } from './Productivity/ProductivityReportPage';
import { fetchProductivityData } from './Productivity/productivityService';

import { GoalProgressPage } from './Goals/GoalProgressPage';
import { fetchGoalAnalytics } from './Goals/goalAnalyticsService';

import { TimeInsightsPage } from './Time/TimeInsightsPage';
import { fetchTimeInsights } from './Time/timeInsightsService';

import { AIRecommendationsPage } from './AI/AIRecommendationsPage';
import { fetchAIRecommendations } from './AI/aiAnalyticsService';

type TabType = 'overview' | 'productivity' | 'goals' | 'time' | 'ai';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    preset: '7d',
  });
  const [isExporting, setIsExporting] = useState(false);

  // Queries
  const {
    data: overviewData,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ['analyticsOverview', dateRange],
    queryFn: () => fetchOverviewMetrics(dateRange),
  });

  const {
    data: productivityData,
    isLoading: productivityLoading,
    refetch: refetchProductivity,
  } = useQuery({
    queryKey: ['productivityData', dateRange.preset],
    queryFn: () => fetchProductivityData(dateRange.preset),
  });

  const {
    data: goalData,
    isLoading: goalLoading,
    refetch: refetchGoals,
  } = useQuery({
    queryKey: ['goalAnalytics'],
    queryFn: fetchGoalAnalytics,
  });

  const {
    data: timeData,
    isLoading: timeLoading,
    refetch: refetchTime,
  } = useQuery({
    queryKey: ['timeInsights'],
    queryFn: fetchTimeInsights,
  });

  const {
    data: aiData,
    isLoading: aiLoading,
    refetch: refetchAI,
  } = useQuery({
    queryKey: ['aiRecommendations'],
    queryFn: fetchAIRecommendations,
  });

  const handleRefreshAll = () => {
    refetchOverview();
    refetchProductivity();
    refetchGoals();
    refetchTime();
    refetchAI();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAnalyticsData({
        range: dateRange,
        includeProductivity: true,
        includeGoals: true,
        includeTime: true,
        includeAI: true,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${dateRange.preset}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AnalyticsHeader />

        <AnalyticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={handleRefreshAll}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Analytics Tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'productivity', label: 'Productivity' },
              { id: 'goals', label: 'Goals Velocity' },
              { id: 'time', label: 'Time Insights' },
              { id: 'ai', label: 'AI Intelligence' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Productivity Score
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {overviewLoading ? '...' : overviewData?.productivityScore}
                </p>
                <span className="inline-block mt-1 text-xs text-emerald-600 font-medium">
                  +{overviewData?.productivityScoreChange}% vs last period
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Tracked Focus Hours
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {overviewLoading ? '...' : `${overviewData?.totalTrackedHours}h`}
                </p>
                <span className="inline-block mt-1 text-xs text-indigo-600 font-medium">
                  +{overviewData?.trackedHoursChange}% optimal allocation
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Goal Completion Rate
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {overviewLoading ? '...' : `${overviewData?.goalCompletionRate}%`}
                </p>
                <span className="inline-block mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {overviewData?.activeGoalsCount} Active Goals
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  AI Recommendations
                </p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                  {overviewLoading ? '...' : overviewData?.aiInsightsGenerated}
                </p>
                <span className="inline-block mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Ready to execute
                </span>
              </div>
            </div>

            <ProductivityReportPage data={productivityData} isLoading={productivityLoading} />
          </div>
        )}

        {activeTab === 'productivity' && (
          <ProductivityReportPage data={productivityData} isLoading={productivityLoading} />
        )}

        {activeTab === 'goals' && (
          <GoalProgressPage data={goalData} isLoading={goalLoading} />
        )}

        {activeTab === 'time' && (
          <TimeInsightsPage data={timeData} isLoading={timeLoading} />
        )}

        {activeTab === 'ai' && (
          <AIRecommendationsPage data={aiData} isLoading={aiLoading} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
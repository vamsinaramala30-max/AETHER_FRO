export interface DateRange {
  startDate: string;
  endDate: string;
  preset: '7d' | '30d' | '90d' | 'custom';
}

export interface OverviewMetrics {
  productivityScore: number;
  productivityScoreChange: number;
  totalTrackedHours: number;
  trackedHoursChange: number;
  activeGoalsCount: number;
  goalCompletionRate: number;
  aiInsightsGenerated: number;
}

export interface AnalyticsExportPayload {
  range: DateRange;
  includeProductivity: boolean;
  includeGoals: boolean;
  includeTime: boolean;
  includeAI: boolean;
}

export const fetchOverviewMetrics = async (range: DateRange): Promise<OverviewMetrics> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const multiplier = range.preset === '7d' ? 1 : range.preset === '30d' ? 1.1 : 1.2;

  return {
    productivityScore: Math.min(100, Math.round(84 * multiplier)),
    productivityScoreChange: 5.4,
    totalTrackedHours: Math.round(42.5 * multiplier),
    trackedHoursChange: 8.2,
    activeGoalsCount: 12,
    goalCompletionRate: 78.5,
    aiInsightsGenerated: 24,
  };
};

export const exportAnalyticsData = async (payload: AnalyticsExportPayload): Promise<Blob> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const reportData = {
    exportedAt: new Date().toISOString(),
    filterRange: payload.range,
    status: 'Success',
    summary: 'Analytics export generated successfully.',
  };

  const jsonString = JSON.stringify(reportData, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
};

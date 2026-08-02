export interface OverviewMetric {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  category: 'productivity' | 'focus' | 'tasks' | 'goals';
}

export async function fetchDailyOverviewMetrics(): Promise<OverviewMetric[]> {
  return [
    {
      id: 'metric-1',
      title: 'Focus Hours',
      value: '5.4 hrs',
      changePercentage: 12.5,
      trend: 'up',
      timeframe: 'vs yesterday',
      category: 'focus',
    },
    {
      id: 'metric-2',
      title: 'Task Completion Rate',
      value: '88%',
      changePercentage: 4.2,
      trend: 'up',
      timeframe: 'vs average',
      category: 'tasks',
    },
    {
      id: 'metric-3',
      title: 'Active Blockers',
      value: 2,
      changePercentage: -50.0,
      trend: 'down',
      timeframe: 'vs last week',
      category: 'productivity',
    },
    {
      id: 'metric-4',
      title: 'Weekly Goal Progress',
      value: '72%',
      changePercentage: 0,
      trend: 'neutral',
      timeframe: 'on track',
      category: 'goals',
    },
  ];
}

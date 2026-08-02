export interface TimeDistribution {
  category: 'Focus Time' | 'Break Time' | 'Meetings' | 'Learning' | 'Personal Projects';
  hours: number;
  fillColor: string;
}

export interface TimeInsightsSummary {
  totalTrackedHours: number;
  focusTime: number;
  breakTime: number;
  meetings: number;
  learning: number;
  personalProjects: number;
  distribution: TimeDistribution[];
}

export const fetchTimeInsights = async (): Promise<TimeInsightsSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    totalTrackedHours: 42.5,
    focusTime: 24.0,
    breakTime: 4.5,
    meetings: 6.0,
    learning: 5.0,
    personalProjects: 3.0,
    distribution: [
      { category: 'Focus Time', hours: 24.0, fillColor: '#6366f1' },
      { category: 'Meetings', hours: 6.0, fillColor: '#f59e0b' },
      { category: 'Learning', hours: 5.0, fillColor: '#10b981' },
      { category: 'Break Time', hours: 4.5, fillColor: '#64748b' },
      { category: 'Personal Projects', hours: 3.0, fillColor: '#ec4899' },
    ],
  };
};

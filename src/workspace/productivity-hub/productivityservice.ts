// frontend/src/workspace/productivity-hub/productivityService.ts

export interface ProductivityStatsData {
  focusTimeToday: number; // in minutes
  tasksCompleted: number;
  efficiencyScore: number; // percentage
  weeklyComparison: number; // differential indicator
}

export interface ChartDataPoint {
  day: string;
  focusMinutes: number;
  tasks: number;
}

const STATS_STORAGE_KEY = 'aether_productivity_stats';

const defaultStats: ProductivityStatsData = {
  focusTimeToday: 145,
  tasksCompleted: 8,
  efficiencyScore: 92,
  weeklyComparison: 14,
};

const defaultHistory: ChartDataPoint[] = [
  { day: 'Mon', focusMinutes: 120, tasks: 5 },
  { day: 'Tue', focusMinutes: 160, tasks: 7 },
  { day: 'Wed', focusMinutes: 90, tasks: 4 },
  { day: 'Thu', focusMinutes: 180, tasks: 9 },
  { day: 'Fri', focusMinutes: 145, tasks: 8 },
  { day: 'Sat', focusMinutes: 45, tasks: 2 },
  { day: 'Sun', focusMinutes: 0, tasks: 0 },
];

export const productivityService = {
  getStats(): Promise<ProductivityStatsData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window === 'undefined') {
          resolve(defaultStats);
          return;
        }
        const stored = localStorage.getItem(STATS_STORAGE_KEY);
        if (typeof stored !== 'string' || stored.trim() === '') {
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(defaultStats));
          resolve(defaultStats);
          return;
        }
        try {
          const parsed = JSON.parse(stored) as ProductivityStatsData;
          resolve(parsed);
        } catch {
          resolve(defaultStats);
        }
      }, 250);
    });
  },

  getHistory(): Promise<ChartDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(defaultHistory);
      }, 250);
    });
  },

  logFocusSession(minutes: number): Promise<ProductivityStatsData> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(defaultStats);
        return;
      }
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      let stats: ProductivityStatsData = defaultStats;
      if (typeof stored === 'string' && stored.trim() !== '') {
        try {
          stats = JSON.parse(stored) as ProductivityStatsData;
        } catch {
          stats = defaultStats;
        }
      }

      const updated = {
        ...stats,
        focusTimeToday: stats.focusTimeToday + minutes,
        tasksCompleted: minutes >= 25 ? stats.tasksCompleted + 1 : stats.tasksCompleted,
      };

      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      resolve(updated);
    });
  },
};

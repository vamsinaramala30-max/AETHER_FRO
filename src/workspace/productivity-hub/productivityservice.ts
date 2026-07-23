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
  async getStats(): Promise<ProductivityStatsData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window === 'undefined') { resolve(defaultStats); return; }
        const stored = localStorage.getItem(STATS_STORAGE_KEY);
        if (!stored) {
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(defaultStats));
          resolve(defaultStats); return;
        }
        resolve(JSON.parse(stored));
      }, 250);
    });
  },

  async getHistory(): Promise<ChartDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(defaultHistory);
      }, 250);
    });
  },

  async logFocusSession(minutes: number): Promise<ProductivityStatsData> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') { resolve(defaultStats); return; }
      const stored = localStorage.getItem(STATS_STORAGE_KEY);
      const stats: ProductivityStatsData = stored ? JSON.parse(stored) : defaultStats;
      
      stats.focusTimeToday += minutes;
      if (minutes >= 25) {
        stats.tasksCompleted += 1; // logical increment per deep execution session
      }
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
      resolve(stats);
    });
  }
};
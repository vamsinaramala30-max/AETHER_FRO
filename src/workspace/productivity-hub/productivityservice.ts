import { taskService } from '../../projects/tasks/taskservice';

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

const STATS_STORAGE_KEY = 'aether_productivity_stats_v2';

const emptyHistory: ChartDataPoint[] = [
  { day: 'Mon', focusMinutes: 0, tasks: 0 },
  { day: 'Tue', focusMinutes: 0, tasks: 0 },
  { day: 'Wed', focusMinutes: 0, tasks: 0 },
  { day: 'Thu', focusMinutes: 0, tasks: 0 },
  { day: 'Fri', focusMinutes: 0, tasks: 0 },
  { day: 'Sat', focusMinutes: 0, tasks: 0 },
  { day: 'Sun', focusMinutes: 0, tasks: 0 },
];

export const productivityService = {
  async getStats(): Promise<ProductivityStatsData> {
    let focusMins = 0;
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STATS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          focusMins = typeof parsed.focusTimeToday === 'number' ? parsed.focusTimeToday : 0;
        }
      }
    } catch {
      focusMins = 0;
    }

    // Fetch real tasks from taskService to calculate actual completed task count
    let completedTaskCount = 0;
    try {
      const realTasks = await taskService.getTasks();
      if (Array.isArray(realTasks)) {
        completedTaskCount = realTasks.filter(
          (t: any) => t.status === 'DONE' || t.status === 'COMPLETED' || t.completed === true,
        ).length;
      }
    } catch {
      completedTaskCount = 0;
    }

    const efficiency = focusMins > 0 ? Math.min(100, Math.round((focusMins / 120) * 100)) : 0;

    return {
      focusTimeToday: focusMins,
      tasksCompleted: completedTaskCount,
      efficiencyScore: efficiency,
      weeklyComparison: 0,
    };
  },

  async getHistory(): Promise<ChartDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(emptyHistory);
      }, 150);
    });
  },

  async logFocusSession(minutes: number): Promise<ProductivityStatsData> {
    let currentFocus = 0;
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STATS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          currentFocus = typeof parsed.focusTimeToday === 'number' ? parsed.focusTimeToday : 0;
        }
      }
    } catch {
      currentFocus = 0;
    }

    const newFocus = currentFocus + minutes;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify({ focusTimeToday: newFocus }));
      }
    } catch {
      // Ignore
    }

    return this.getStats();
  },
};

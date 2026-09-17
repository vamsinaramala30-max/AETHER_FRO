import { taskService } from '../../projects/tasks/taskservice';
import { apiClient } from '../../api/client';

export interface ProductivityStatsData {
  focusTimeToday: number; // in minutes
  tasksCompleted: number;
  efficiencyScore: number; // percentage
  weeklyComparison?: number; // optional legacy field
}

export interface ChartDataPoint {
  day: string;
  focusMinutes: number;
  tasks: number;
}

export const FOCUS_HISTORY_KEY = 'focus-timer-history';

export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayFocusMinutes(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(FOCUS_HISTORY_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const today = getLocalDateKey();
    const todayData = parsed[today];
    if (typeof todayData === 'number') {
      return todayData;
    }
    if (Array.isArray(todayData)) {
      return todayData.reduce((sum: number, item: any) => {
        if (typeof item === 'number') return sum + item;
        if (item && typeof item.minutes === 'number') return sum + item.minutes;
        return sum;
      }, 0);
    }
    return 0;
  } catch {
    return 0;
  }
}

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
    let focusMins = getTodayFocusMinutes();

    // Fetch server focus analytics for current user
    try {
      const res = await apiClient.get<any>('/workspaces/default/focus/analytics');
      const data = res?.data || res;
      if (typeof data?.totalFocusMinutes === 'number') {
        focusMins = Math.max(focusMins, data.totalFocusMinutes);
      }
    } catch {
      // Fallback to local
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
    // 1. Sync session with backend Focus API
    try {
      const startRes = await apiClient.post<any>('/workspaces/default/focus/start', {
        durationMinutes: minutes,
        type: 'focus',
      });
      const session = startRes?.data || startRes;
      if (session?.id) {
        await apiClient.post<any>(`/workspaces/default/focus/${session.id}/complete`, {
          durationSeconds: minutes * 60,
        });
      }
    } catch {
      // Ignore network errors for local cache fallback
    }

    // 2. Update local storage cache
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(FOCUS_HISTORY_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const today = getLocalDateKey();
        const newSession = {
          id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          minutes,
          createdAt: Date.now(),
        };

        const existing = parsed[today];
        let updated: any[];
        if (Array.isArray(existing)) {
          updated = [newSession, ...existing];
        } else if (typeof existing === 'number') {
          updated = [
            newSession,
            { id: `legacy_${today}`, minutes: existing, createdAt: Date.now() },
          ];
        } else {
          updated = [newSession];
        }

        parsed[today] = updated;
        window.localStorage.setItem(FOCUS_HISTORY_KEY, JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent('aether-focus-updated'));
      }
    } catch {
      // Ignore
    }

    return this.getStats();
  },
};

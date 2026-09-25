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

export interface FocusSessionItem {
  id: string;
  minutes: number;
  createdAt: number;
  taskId?: string | null;
  projectId?: string | null;
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

export const productivityService = {
  async getStats(): Promise<ProductivityStatsData> {
    let focusMins = 0;

    // 1. Fetch server focus analytics for current user (authoritative)
    try {
      const res = await apiClient.get<any>('/workspaces/default/focus/analytics');
      const data = res?.data || res;
      if (typeof data?.totalFocusMinutes === 'number') {
        focusMins = data.totalFocusMinutes;
      }
    } catch {
      // Offline fallback: load from cached local data
      focusMins = getTodayFocusMinutes();
    }

    // 2. Fetch real tasks from taskService to calculate actual completed task count
    let completedTaskCount = 0;
    try {
      const realTasks = await taskService.getTasks();
      if (Array.isArray(realTasks)) {
        completedTaskCount = realTasks.filter(
          (t: any) => t.status === 'done' || t.status === 'DONE' || t.completed === true,
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

  async getSessions(): Promise<FocusSessionItem[]> {
    try {
      const res = await apiClient.get<any>('/workspaces/default/focus/history');
      const data = res?.data || res;
      if (Array.isArray(data)) {
        const items: FocusSessionItem[] = data.map((s: any) => {
          const duration =
            s.durationMinutes ||
            (s.actualDurationSeconds ? Math.round(s.actualDurationSeconds / 60) : 0);
          const createdAt = s.startTime
            ? new Date(s.startTime).getTime()
            : s.createdAt
            ? new Date(s.createdAt).getTime()
            : Date.now();
          return {
            id: s.id,
            minutes: duration,
            createdAt,
            taskId: s.taskId || null,
            projectId: s.projectId || null,
          };
        });

        // Sync to localStorage as offline cache
        if (typeof window !== 'undefined') {
          const grouped: Record<string, FocusSessionItem[]> = {};
          for (const item of items) {
            const dayKey = getLocalDateKey(new Date(item.createdAt));
            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(item);
          }
          window.localStorage.setItem(FOCUS_HISTORY_KEY, JSON.stringify(grouped));
        }

        return items;
      }
    } catch (err) {
      console.warn('[ProductivityService] Failed to load server focus history, falling back to cache:', err);
    }

    // Fallback to cache if network request fails
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(FOCUS_HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const items: FocusSessionItem[] = [];
          for (const day of Object.keys(parsed)) {
            const dayItems = parsed[day];
            if (Array.isArray(dayItems)) {
              items.push(...dayItems);
            }
          }
          return items.sort((a, b) => b.createdAt - a.createdAt);
        }
      } catch {
        // empty
      }
    }

    return [];
  },

  async getHistory(): Promise<ChartDataPoint[]> {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Initialize past 7 days
    const dayMap = new Map<string, { day: string; focusMinutes: number; tasks: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateKey(d);
      const dayName = days[d.getDay()];
      dayMap.set(dateKey, { day: dayName, focusMinutes: 0, tasks: 0 });
    }

    try {
      const sessions = await this.getSessions();
      for (const s of sessions) {
        const key = getLocalDateKey(new Date(s.createdAt));
        const entry = dayMap.get(key);
        if (entry) {
          entry.focusMinutes += s.minutes;
        }
      }
    } catch {
      // Ignore
    }

    try {
      const tasks = await taskService.getTasks();
      if (Array.isArray(tasks)) {
        for (const t of tasks as any[]) {
          if (t.status === 'done' || t.status === 'DONE' || t.completed === true) {
            const dateStr = t.updatedAt || t.completedAt || t.createdAt;
            if (dateStr) {
              const key = getLocalDateKey(new Date(dateStr));
              const entry = dayMap.get(key);
              if (entry) {
                entry.tasks += 1;
              }
            }
          }
        }
      }
    } catch {
      // Ignore
    }

    return Array.from(dayMap.values());
  },

  async logFocusSession(
    minutes: number,
    options?: { taskId?: string; projectId?: string },
  ): Promise<ProductivityStatsData> {
    // 1. Authoritative write: sync session with backend Focus API in PostgreSQL
    const startRes = await apiClient.post<any>('/workspaces/default/focus/start', {
      durationMinutes: minutes,
      type: 'focus',
      taskId: options?.taskId || null,
      projectId: options?.projectId || null,
    });
    const session = startRes?.data || startRes;
    if (!session?.id) {
      throw new Error('Focus session creation failed on authoritative backend');
    }

    await apiClient.post<any>(`/workspaces/default/focus/${session.id}/complete`, {
      durationSeconds: minutes * 60,
    });

    // 2. Update local storage cache (as non-authoritative fast view)
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(FOCUS_HISTORY_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const today = getLocalDateKey();
        const newSession: FocusSessionItem = {
          id: session.id,
          minutes,
          createdAt: Date.now(),
          taskId: options?.taskId || null,
          projectId: options?.projectId || null,
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
      // Local cache failure is non-fatal since DB succeeded
    }

    return this.getStats();
  },

  async deleteFocusSession(sessionId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/workspaces/default/focus/${sessionId}`);
    } catch (err) {
      console.error('[ProductivityService] Failed to delete session on server:', err);
      throw err;
    }

    // Clean up local cache
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(FOCUS_HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          let changed = false;
          for (const key of Object.keys(parsed)) {
            if (Array.isArray(parsed[key])) {
              const prevLen = parsed[key].length;
              parsed[key] = parsed[key].filter((item: any) => item.id !== sessionId);
              if (parsed[key].length !== prevLen) changed = true;
              if (parsed[key].length === 0) delete parsed[key];
            }
          }
          if (changed) {
            window.localStorage.setItem(FOCUS_HISTORY_KEY, JSON.stringify(parsed));
            window.dispatchEvent(new CustomEvent('aether-focus-updated'));
          }
        }
      }
    } catch {
      // Local cache cleanup failure is non-fatal
    }

    return true;
  },
};

import { Calendar } from '../types/calendar';
import { apiClient } from '../../../api/client';

const STORAGE_KEY = 'enterprise_calendars';

export const calendarService = {
  async fetchCalendars(): Promise<Calendar[]> {
    try {
      const response = await apiClient.get<any>('/workspace/calendar');
      const items = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(items) && items.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return items;
      }
    } catch (err) {
      console.warn('Backend calendar fetch fallback to local cache:', err);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (typeof raw !== 'string' || raw.trim() === '') return [];
    try {
      const parsed = JSON.parse(raw) as Calendar[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async saveCalendars(calendars: Calendar[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
  },
};

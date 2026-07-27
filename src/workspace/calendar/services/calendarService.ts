import { Calendar } from '../types/calendar';

const STORAGE_KEY = 'enterprise_calendars';

export const calendarService = {
  fetchCalendars(): Promise<Calendar[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (typeof raw !== 'string' || raw.trim() === '') return Promise.resolve([]);
    try {
      const parsed = JSON.parse(raw) as Calendar[];
      return Promise.resolve(Array.isArray(parsed) ? parsed : []);
    } catch {
      return Promise.resolve([]);
    }
  },

  saveCalendars(calendars: Calendar[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
    return Promise.resolve();
  },
};

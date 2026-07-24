import { Calendar } from '../types/calendar';

export class CalendarService {
  private static STORAGE_KEY = 'enterprise_calendars';

  public static async fetchCalendars(): Promise<Calendar[]> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static async saveCalendars(calendars: Calendar[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calendars));
  }
}
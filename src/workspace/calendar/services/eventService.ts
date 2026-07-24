import { CalendarEvent } from '../types/event';

export class EventService {
  private static STORAGE_KEY = 'enterprise_calendar_events';

  public static async fetchEvents(): Promise<CalendarEvent[]> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static async saveEvents(events: CalendarEvent[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }

  public static async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const events = await this.fetchEvents();
    events.push(event);
    await this.saveEvents(events);
    return event;
  }

  public static async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const events = await this.fetchEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Event with ID ${id} not found.`);
    
    events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
    await this.saveEvents(events);
    return events[index];
  }

  public static async deleteEvent(id: string): Promise<void> {
    const events = await this.fetchEvents();
    const filtered = events.filter(e => e.id !== id);
    await this.saveEvents(filtered);
  }
}
import { CalendarEvent } from '../types/event';

const STORAGE_KEY = 'enterprise_calendar_events';

export const eventService = {
  fetchEvents(): Promise<CalendarEvent[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (typeof raw !== 'string' || raw.trim() === '') return Promise.resolve([]);
    try {
      const parsed = JSON.parse(raw) as CalendarEvent[];
      return Promise.resolve(Array.isArray(parsed) ? parsed : []);
    } catch {
      return Promise.resolve([]);
    }
  },

  saveEvents(events: CalendarEvent[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return Promise.resolve();
  },

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const events = await this.fetchEvents();
    events.push(event);
    await this.saveEvents(events);
    return event;
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const events = await this.fetchEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event with ID ${id} not found.`);

    const updated = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
    events[index] = updated;
    await this.saveEvents(events);
    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    const events = await this.fetchEvents();
    const filtered = events.filter((e) => e.id !== id);
    await this.saveEvents(filtered);
  },
};

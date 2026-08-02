import { CalendarEvent } from '../types/event';
import { apiClient } from '../../../api/client';

const STORAGE_KEY = 'enterprise_calendar_events';

export const eventService = {
  async fetchEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<any>('/workspace/calendar/events');
      const items = Array.isArray(response) ? response : response.data || [];
      if (Array.isArray(items) && items.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return items;
      }
    } catch (err) {
      console.warn('Backend event fetch fallback to cached state:', err);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (typeof raw !== 'string' || raw.trim() === '') return [];
    try {
      const parsed = JSON.parse(raw) as CalendarEvent[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async saveEvents(events: CalendarEvent[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    try {
      const response = await apiClient.post<any>('/workspace/calendar/events', event);
      const created = response.data || response;
      if (created && created.id) {
        const events = await this.fetchEvents();
        events.push(created);
        await this.saveEvents(events);
        return created;
      }
    } catch (err) {
      console.warn('Backend createEvent API call fallback:', err);
    }
    const events = await this.fetchEvents();
    events.push(event);
    await this.saveEvents(events);
    return event;
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await apiClient.patch<any>(`/workspace/calendar/events/${id}`, updates);
      const updatedBackend = response.data || response;
      if (updatedBackend) {
        const events = await this.fetchEvents();
        const index = events.findIndex((e) => e.id === id);
        if (index !== -1) {
          events[index] = { ...events[index], ...updatedBackend };
          await this.saveEvents(events);
          return events[index];
        }
      }
    } catch (err) {
      console.warn('Backend updateEvent API call fallback:', err);
    }
    const events = await this.fetchEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event with ID ${id} not found.`);

    const updated = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
    events[index] = updated;
    await this.saveEvents(events);
    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await apiClient.delete(`/workspace/calendar/events/${id}`);
    } catch (err) {
      console.warn('Backend deleteEvent API call fallback:', err);
    }
    const events = await this.fetchEvents();
    const filtered = events.filter((e) => e.id !== id);
    await this.saveEvents(filtered);
  },
};

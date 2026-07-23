// frontend/src/workspace/calendar/calendarService.ts

export interface CalendarEventData {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  color?: string;
  projectId?: string;
  isAllDay?: boolean;
}

// In-memory local persistence fallback that mirrors AETHER storage patterns
const STORAGE_KEY = 'aether_workspace_calendar_events';

const getLocalEvents = (): CalendarEventData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed default workspace events
    const now = new Date();
    const defaults: CalendarEventData[] = [
      {
        id: '1',
        title: 'AETHER Architecture Review',
        description: 'Review workspace sub-modules and state normalization layers.',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30).toISOString(),
        color: '#3b82f6',
      },
      {
        id: '2',
        title: 'Sprint Planning & Sync',
        description: 'Aligning frontend core layout components with backend abstractions.',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0).toISOString(),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0).toISOString(),
        color: '#10b981',
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
};

export const calendarService = {
  async getEvents(): Promise<CalendarEventData[]> {
    // Simulate minor asynchronous network latency native to AETHER engine APIs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getLocalEvents());
      }, 300);
    });
  },

  async createEvent(event: Omit<CalendarEventData, 'id'>): Promise<CalendarEventData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = getLocalEvents();
        const newEvent: CalendarEventData = {
          ...event,
          id: crypto.randomUUID(),
        };
        events.push(newEvent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        resolve(newEvent);
      }, 200);
    });
  },

  async updateEvent(id: string, updatedData: Partial<CalendarEventData>): Promise<CalendarEventData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = getLocalEvents();
        const index = events.findIndex(e => e.id === id);
        if (index === -1) { reject(new Error('Event not found')); return; }
        
        events[index] = { ...events[index], ...updatedData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        resolve(events[index]);
      }, 200);
    });
  },

  async deleteEvent(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = getLocalEvents();
        const filtered = events.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        resolve(true);
      }, 200);
    });
  }
};
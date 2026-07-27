import { CalendarEvent } from '../types/event';

export const syncService = {
  syncPendingEvents(offlineQueue: CalendarEvent[]): Promise<CalendarEvent[]> {
    // Simulates syncing queued local events with server database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(offlineQueue.map((e) => ({ ...e, isPendingSync: false })));
      }, 800);
    });
  },
};

import { CalendarEvent } from '../types/event';

export class SyncService {
  public static async syncPendingEvents(offlineQueue: CalendarEvent[]): Promise<CalendarEvent[]> {
    // Simulates syncing queued local events with server database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(offlineQueue.map(e => ({ ...e, isPendingSync: false })));
      }, 800);
    });
  }
}
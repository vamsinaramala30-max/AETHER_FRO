import { CalendarEvent } from '../types/event';

export const googleCalendarService = {
  syncWithGoogle(): Promise<CalendarEvent[]> {
    // Integration boilerplate for Google OAuth2 / Calendar API
    return Promise.resolve([]);
  },
};

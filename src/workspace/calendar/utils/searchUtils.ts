import { CalendarEvent } from '../types/event';

export interface SearchFilterOptions {
  query?: string;
  calendarIds?: string[];
  startDate?: string;
  endDate?: string;
  participantEmails?: string[];
  hasAttachments?: boolean;
  hasLocation?: boolean;
}

export const filterEvents = (events: CalendarEvent[], filters: SearchFilterOptions): CalendarEvent[] => {
  return events.filter(event => {
    // Text search query
    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const titleMatch = event.title.toLowerCase().includes(q);
      const descMatch = event.description?.toLowerCase().includes(q) || false;
      const locMatch = event.location?.name.toLowerCase().includes(q) || false;
      
      if (!titleMatch && !descMatch && !locMatch) return false;
    }

    // Calendar filter
    if (filters.calendarIds && filters.calendarIds.length > 0) {
      if (!filters.calendarIds.includes(event.calendarId)) return false;
    }

    // Date range filter
    if (filters.startDate) {
      if (new Date(event.end) < new Date(filters.startDate)) return false;
    }
    if (filters.endDate) {
      if (new Date(event.start) > new Date(filters.endDate)) return false;
    }

    // Participant filter
    if (filters.participantEmails && filters.participantEmails.length > 0) {
      const eventEmails = event.participants.map(p => p.email.toLowerCase());
      const matchesParticipant = filters.participantEmails.some(email =>
        eventEmails.includes(email.toLowerCase())
      );
      if (!matchesParticipant) return false;
    }

    // Attachments requirement
    if (filters.hasAttachments && (!event.attachments || event.attachments.length === 0)) {
      return false;
    }

    // Location requirement
    if (filters.hasLocation && (!event.location || !event.location.name)) {
      return false;
    }

    return true;
  });
};
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

export const filterEvents = (
  events: CalendarEvent[],
  filters: SearchFilterOptions,
): CalendarEvent[] => {
  return events.filter((event) => {
    // Text search query
    if (typeof filters.query === 'string' && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const titleMatch = event.title.toLowerCase().includes(q);
      const descMatch =
        typeof event.description === 'string' ? event.description.toLowerCase().includes(q) : false;
      const locMatch =
        typeof event.location?.name === 'string'
          ? event.location.name.toLowerCase().includes(q)
          : false;

      if (!titleMatch && !descMatch && !locMatch) return false;
    }

    // Calendar filter
    if (Array.isArray(filters.calendarIds) && filters.calendarIds.length > 0) {
      if (!filters.calendarIds.includes(event.calendarId)) return false;
    }

    // Date range filter
    if (typeof filters.startDate === 'string' && filters.startDate.trim() !== '') {
      if (new Date(event.end) < new Date(filters.startDate)) return false;
    }
    if (typeof filters.endDate === 'string' && filters.endDate.trim() !== '') {
      if (new Date(event.start) > new Date(filters.endDate)) return false;
    }

    // Participant filter
    if (Array.isArray(filters.participantEmails) && filters.participantEmails.length > 0) {
      const eventEmails = event.participants.map((p) => p.email.toLowerCase());
      const matchesParticipant = filters.participantEmails.some((email) =>
        eventEmails.includes(email.toLowerCase()),
      );
      if (!matchesParticipant) return false;
    }

    // Attachments requirement
    if (
      filters.hasAttachments === true &&
      (!Array.isArray(event.attachments) || event.attachments.length === 0)
    ) {
      return false;
    }

    // Location requirement
    if (
      filters.hasLocation === true &&
      (event.location === undefined ||
        typeof event.location.name !== 'string' ||
        event.location.name.trim() === '')
    ) {
      return false;
    }

    return true;
  });
};

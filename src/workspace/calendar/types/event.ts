import { Participant } from './participant';
import { RecurrenceRule, RecurrenceException } from './recurrence';
import { EventReminder } from './reminder';

export type EventStatus = 'confirmed' | 'tentative' | 'cancelled';
export type EventVisibility = 'default' | 'public' | 'private' | 'confidential';

export interface EventAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeInBytes: number;
}

export interface EventLocation {
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  meetingUrl?: string; // Zoom, Google Meet, Teams link
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  start: string; // ISO 8601 string (e.g. 2026-07-24T09:00:00Z)
  end: string; // ISO 8601 string
  isAllDay: boolean;
  timeZone: string;
  color?: string; // Overrides calendar color if set
  location?: EventLocation;
  status: EventStatus;
  visibility: EventVisibility;
  organizer: Participant;
  participants: Participant[];
  reminders: EventReminder[];
  attachments: EventAttachment[];

  // Recurrence
  recurrenceRule?: RecurrenceRule;
  recurrenceId?: string; // If instance of a recurring series
  recurringExceptionDates?: string[]; // Dates (YYYY-MM-DD) skipped/altered
  exceptions?: RecurrenceException[];

  // Metadata & Sync
  createdAt: string;
  updatedAt: string;
  etag?: string;
  isOfflineCreated?: boolean;
  isPendingSync?: boolean;
}

export interface EventDragPayload {
  event: CalendarEvent;
  type: 'move' | 'resize-start' | 'resize-end';
  originalStart: string;
  originalEnd: string;
}

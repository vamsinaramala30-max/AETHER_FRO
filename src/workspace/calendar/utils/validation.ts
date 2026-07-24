import { CalendarEvent } from '../types/event';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateCalendarEvent = (event: Partial<CalendarEvent>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!event.title || event.title.trim() === '') {
    errors.push({ field: 'title', message: 'Event title is required.' });
  }

  if (!event.calendarId) {
    errors.push({ field: 'calendarId', message: 'Target calendar must be selected.' });
  }

  if (!event.start) {
    errors.push({ field: 'start', message: 'Start time is required.' });
  }

  if (!event.end) {
    errors.push({ field: 'end', message: 'End time is required.' });
  }

  if (event.start && event.end) {
    const startMs = new Date(event.start).getTime();
    const endMs = new Date(event.end).getTime();

    if (isNaN(startMs)) {
      errors.push({ field: 'start', message: 'Start time is invalid.' });
    }
    if (isNaN(endMs)) {
      errors.push({ field: 'end', message: 'End time is invalid.' });
    }
    if (startMs > endMs) {
      errors.push({ field: 'end', message: 'End time cannot be before start time.' });
    }
  }

  return errors;
};
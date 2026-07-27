import { CalendarEvent } from '../types/event';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateCalendarEvent = (event: Partial<CalendarEvent>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof event.title !== 'string' || event.title.trim() === '') {
    errors.push({ field: 'title', message: 'Event title is required.' });
  }

  if (typeof event.calendarId !== 'string' || event.calendarId.trim() === '') {
    errors.push({ field: 'calendarId', message: 'Target calendar must be selected.' });
  }

  if (typeof event.start !== 'string' || event.start.trim() === '') {
    errors.push({ field: 'start', message: 'Start time is required.' });
  }

  if (typeof event.end !== 'string' || event.end.trim() === '') {
    errors.push({ field: 'end', message: 'End time is required.' });
  }

  if (
    typeof event.start === 'string' &&
    event.start.trim() !== '' &&
    typeof event.end === 'string' &&
    event.end.trim() !== ''
  ) {
    const startMs = new Date(event.start).getTime();
    const endMs = new Date(event.end).getTime();

    if (Number.isNaN(startMs)) {
      errors.push({ field: 'start', message: 'Start time is invalid.' });
    }
    if (Number.isNaN(endMs)) {
      errors.push({ field: 'end', message: 'End time is invalid.' });
    }
    if (startMs > endMs) {
      errors.push({ field: 'end', message: 'End time cannot be before start time.' });
    }
  }

  return errors;
};

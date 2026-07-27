import { CalendarEvent } from '../types/event';
import { generateOccurrences } from '../utils/recurrenceUtils';

export const recurrenceService = {
  expandEventsForRange(events: CalendarEvent[], rangeStart: Date, rangeEnd: Date): CalendarEvent[] {
    const result: CalendarEvent[] = [];

    events.forEach((event) => {
      if (event.recurrenceRule !== undefined) {
        const expanded = generateOccurrences(event, rangeStart, rangeEnd);
        result.push(...expanded);
      } else {
        result.push(event);
      }
    });

    return result;
  },
};

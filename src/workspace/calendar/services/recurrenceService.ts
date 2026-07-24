import { CalendarEvent } from '../types/event';
import { generateOccurrences } from '../utils/recurrenceUtils';

export class RecurrenceService {
  public static expandEventsForRange(
    events: CalendarEvent[],
    rangeStart: Date,
    rangeEnd: Date
  ): CalendarEvent[] {
    const result: CalendarEvent[] = [];

    events.forEach(event => {
      if (event.recurrenceRule) {
        const expanded = generateOccurrences(event, rangeStart, rangeEnd);
        result.push(...expanded);
      } else {
        result.push(event);
      }
    });

    return result;
  }
}
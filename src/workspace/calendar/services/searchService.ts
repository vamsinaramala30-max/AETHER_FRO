import { CalendarEvent } from '../types/event';
import { filterEvents, SearchFilterOptions } from '../utils/searchUtils';

export class SearchService {
  public static search(events: CalendarEvent[], filters: SearchFilterOptions): CalendarEvent[] {
    return filterEvents(events, filters);
  }
}
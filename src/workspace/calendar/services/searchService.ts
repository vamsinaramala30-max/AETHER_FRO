import { CalendarEvent } from '../types/event';
import { filterEvents, SearchFilterOptions } from '../utils/searchUtils';

export const searchService = {
  search(events: CalendarEvent[], filters: SearchFilterOptions): CalendarEvent[] {
    return filterEvents(events, filters);
  },
};

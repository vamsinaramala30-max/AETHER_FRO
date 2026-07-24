import { useMemo } from 'react';
import { useEventStore } from '../store/eventStore';
import { useCalendarStore } from '../store/calendarStore';
import { useFilterStore } from '../store/filterStore';
import { RecurrenceService } from '../services/recurrenceService';
import { SearchService } from '../services/searchService';

export const useEvents = (rangeStart?: Date, rangeEnd?: Date) => {
  const { events, addEvent, updateEvent, deleteEvent, openEventForm, openEventDetails } = useEventStore();
  const { selectedCalendarIds } = useCalendarStore();
  const { filters } = useFilterStore();

  const filteredEvents = useMemo(() => {
    // 1. Filter by selected calendar visibility
    let activeEvents = events.filter(e => selectedCalendarIds.includes(e.calendarId));

    // 2. Expand recurring events if range is supplied
    if (rangeStart && rangeEnd) {
      activeEvents = RecurrenceService.expandEventsForRange(activeEvents, rangeStart, rangeEnd);
    }

    // 3. Apply active global filters and search query
    return SearchService.search(activeEvents, filters);
  }, [events, selectedCalendarIds, rangeStart, rangeEnd, filters]);

  return {
    events: filteredEvents,
    allRawEvents: events,
    addEvent,
    updateEvent,
    deleteEvent,
    openEventForm,
    openEventDetails,
  };
};
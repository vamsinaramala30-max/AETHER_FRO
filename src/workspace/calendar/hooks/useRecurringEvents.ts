import { useCallback } from 'react';
import { CalendarEvent } from '../types/event';
import { RecurrenceRule } from '../types/recurrence';

export const useRecurringEvents = () => {
  const setRecurrence = useCallback((event: CalendarEvent, rule: RecurrenceRule): CalendarEvent => {
    return {
      ...event,
      recurrenceRule: rule,
    };
  }, []);

  const clearRecurrence = useCallback((event: CalendarEvent): CalendarEvent => {
    const copy = { ...event };
    delete copy.recurrenceRule;
    return copy;
  }, []);

  return {
    setRecurrence,
    clearRecurrence,
  };
};
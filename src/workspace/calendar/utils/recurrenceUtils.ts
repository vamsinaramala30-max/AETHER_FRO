import { CalendarEvent } from '../types/event';
import { RecurrenceRule, DayOfWeek } from '../types/recurrence';
import { addDays, parseISODate, toISODateString } from './dateUtils';

const DAY_MAP: Record<DayOfWeek, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

export const generateOccurrences = (
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] => {
  if (!event.recurrenceRule) {
    return [event];
  }

  const occurrences: CalendarEvent[] = [];
  const rule = event.recurrenceRule;
  const eventStart = parseISODate(event.start);
  const eventEnd = parseISODate(event.end);
  const eventDurationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);

  let current = new Date(eventStart);
  let count = 0;
  const maxOccurrences = typeof rule.count === 'number' && rule.count > 0 ? rule.count : 500; // Safety threshold
  const untilDate =
    typeof rule.until === 'string' && rule.until.trim() !== ''
      ? parseISODate(rule.until)
      : rangeEnd;

  while (current <= rangeEnd && current <= untilDate && count < maxOccurrences) {
    const isExcluded =
      typeof event.recurringExceptionDates !== 'undefined' &&
      event.recurringExceptionDates.some((exDate) => exDate === toISODateString(current));

    if (!isExcluded && current >= rangeStart) {
      if (matchesRecurrenceCondition(current, rule)) {
        const instanceStart = new Date(current);
        const instanceEnd = new Date(instanceStart.getTime() + eventDurationMinutes * 60 * 1000);

        occurrences.push({
          ...event,
          id: `${event.id}_${toISODateString(instanceStart)}`,
          recurrenceId: event.id,
          start: instanceStart.toISOString(),
          end: instanceEnd.toISOString(),
        });
        count++;
      }
    }

    // Step current date forward according to frequency
    switch (rule.freq) {
      case 'DAILY':
        current = addDays(current, typeof rule.interval === 'number' ? rule.interval : 1);
        break;
      case 'WEEKLY':
        current = addDays(current, 1);
        break;
      case 'MONTHLY':
        current.setMonth(
          current.getMonth() + (typeof rule.interval === 'number' ? rule.interval : 1),
        );
        break;
      case 'YEARLY':
        current.setFullYear(
          current.getFullYear() + (typeof rule.interval === 'number' ? rule.interval : 1),
        );
        break;
    }
  }

  return occurrences;
};

const matchesRecurrenceCondition = (date: Date, rule: RecurrenceRule): boolean => {
  if (rule.freq === 'WEEKLY' && Array.isArray(rule.byDay) && rule.byDay.length > 0) {
    const dayIndex = date.getDay();
    const allowedDays = rule.byDay.map((d) => DAY_MAP[d]);
    if (!allowedDays.includes(dayIndex)) return false;
  }

  if (rule.freq === 'MONTHLY' && Array.isArray(rule.byMonthDay)) {
    if (!rule.byMonthDay.includes(date.getDate())) return false;
  }

  return true;
};

export const formatRecurrenceRuleText = (rule?: RecurrenceRule): string => {
  if (!rule) return 'Does not repeat';

  const freqMap: Record<string, string> = {
    DAILY: 'day',
    WEEKLY: 'week',
    MONTHLY: 'month',
    YEARLY: 'year',
  };

  const unit = freqMap[rule.freq] ?? 'day';
  let text =
    typeof rule.interval === 'number' && rule.interval > 1
      ? `Every ${String(rule.interval)} ${unit}s`
      : `Every ${unit}`;

  if (Array.isArray(rule.byDay) && rule.byDay.length > 0) {
    text += ` on ${rule.byDay.join(', ')}`;
  }

  if (typeof rule.until === 'string' && rule.until.trim() !== '') {
    text += ` until ${rule.until}`;
  } else if (typeof rule.count === 'number' && rule.count > 0) {
    text += `, ${String(rule.count)} times`;
  }

  return text;
};

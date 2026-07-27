export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type DayOfWeek = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';

export interface RecurrenceRule {
  freq: RecurrenceFrequency;
  interval: number; // e.g. every 2 weeks
  count?: number; // total occurrences
  until?: string; // ISO Date YYYY-MM-DD
  byDay?: DayOfWeek[]; // e.g. ['MO', 'WE', 'FR']
  byMonthDay?: number[]; // e.g. [1, 15]
  byMonth?: number[]; // 1 to 12
  wkst?: DayOfWeek; // Week start day, default 'MO' or 'SU'
}

export interface RecurrenceException {
  originalStart: string; // ISO 8601 string
  isCancelled: boolean;
  modifiedEventId?: string;
}

import { DayOfWeek } from '../types/recurrence';
import { CalendarViewType } from '../types/calendar';

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; shortLabel: string }[] = [
  { key: 'SU', label: 'Sunday', shortLabel: 'Sun' },
  { key: 'MO', label: 'Monday', shortLabel: 'Mon' },
  { key: 'TU', label: 'Tuesday', shortLabel: 'Tue' },
  { key: 'WE', label: 'Wednesday', shortLabel: 'Wed' },
  { key: 'TH', label: 'Thursday', shortLabel: 'Thu' },
  { key: 'FR', label: 'Friday', shortLabel: 'Fri' },
  { key: 'SA', label: 'Saturday', shortLabel: 'Sat' },
];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CALENDAR_VIEWS: { type: CalendarViewType; label: string; shortcut: string }[] = [
  { type: 'day', label: 'Day', shortcut: 'D' },
  { type: 'week', label: 'Week', shortcut: 'W' },
  { type: 'month', label: 'Month', shortcut: 'M' },
  { type: 'year', label: 'Year', shortcut: 'Y' },
  { type: 'agenda', label: 'Agenda', shortcut: 'A' },
];

export const DEFAULT_EVENT_COLORS = [
  { hex: '#039be5', name: 'Peacock' },
  { hex: '#7986cb', name: 'Lavender' },
  { hex: '#33b679', name: 'Sage' },
  { hex: '#8e24aa', name: 'Grape' },
  { hex: '#e67c73', name: 'Flamingo' },
  { hex: '#f6bf26', name: 'Banana' },
  { hex: '#f4511e', name: 'Tangerine' },
  { hex: '#039be5', name: 'Blue' },
  { hex: '#616161', name: 'Graphite' },
  { hex: '#3f51b5', name: 'Blueberry' },
  { hex: '#0b8043', name: 'Basil' },
  { hex: '#d50000', name: 'Tomato' },
];

export const DEFAULT_REMINDER_OPTIONS = [
  { minutes: 0, label: 'At time of event' },
  { minutes: 5, label: '5 minutes before' },
  { minutes: 10, label: '10 minutes before' },
  { minutes: 15, label: '15 minutes before' },
  { minutes: 30, label: '30 minutes before' },
  { minutes: 60, label: '1 hour before' },
  { minutes: 120, label: '2 hours before' },
  { minutes: 1440, label: '1 day before' },
  { minutes: 2880, label: '2 days before' },
  { minutes: 10080, label: '1 week before' },
];

export const TIME_SLOT_HEIGHT_PX = 48; // Height in pixels for a 1-hour slot in day/week views

export type CalendarAccessLevel = 'owner' | 'editor' | 'viewer' | 'freeBusy';

export interface Calendar {
  id: string;
  title: string;
  description?: string;
  color: string; // Hex color code
  backgroundColor?: string;
  foregroundColor?: string;
  isPrimary: boolean;
  isVisible: boolean;
  isCustom: boolean;
  accessLevel: CalendarAccessLevel;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  syncToken?: string;
  source?: 'local' | 'google' | 'outlook' | 'apple';
  externalId?: string;
}

export interface CalendarListFilter {
  searchQuery?: string;
  showHidden?: boolean;
  sources?: Array<'local' | 'google' | 'outlook' | 'apple'>;
}

export type CalendarViewType = 'day' | 'week' | 'month' | 'year' | 'agenda';

export interface ViewState {
  currentView: CalendarViewType;
  currentDate: string; // ISO 8601 string YYYY-MM-DD
  selectedTimeZone: string;
  isMiniCalendarOpen: boolean;
  isSidebarOpen: boolean;
}
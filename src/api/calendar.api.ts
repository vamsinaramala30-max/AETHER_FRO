import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface CalendarDTO {
  id: string;
  title: string;
  color: string;
  isPrimary: boolean;
  isVisible: boolean;
  accessLevel: string;
  ownerId: string;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventDTO {
  id: string;
  calendarId: string | null;
  title: string;
  start: string;
  end: string;
  isAllDay: boolean;
  location?: string | null;
  description?: string | null;
  color?: string;
  status: string;
  organizer: {
    id: string;
    displayName: string;
    email: string;
    role?: string;
  };
  projectId?: string | null;
  taskId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarEventPayload {
  title: string;
  start: string;
  end: string;
  isAllDay?: boolean;
  color?: string;
  location?: string;
  description?: string;
  projectId?: string;
  taskId?: string;
  calendarId?: string;
}

export interface UpdateCalendarEventPayload {
  title?: string;
  start?: string;
  end?: string;
  isAllDay?: boolean;
  color?: string;
  location?: string;
  description?: string;
}

export interface CreateCalendarPayload {
  title: string;
  color?: string;
  timeZone?: string;
}

export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiListDataResponse<T> {
  data: T[];
}

export const calendarApi = {
  // Calendars (categories)
  getCalendars: (config?: RequestConfig): Promise<ApiListDataResponse<CalendarDTO>> =>
    apiClient.get<ApiListDataResponse<CalendarDTO>>(ENDPOINTS.CALENDAR.CALENDARS, config),

  createCalendar: (
    payload: CreateCalendarPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<CalendarDTO>> =>
    apiClient.post<ApiDataResponse<CalendarDTO>>(ENDPOINTS.CALENDAR.CALENDARS, payload, config),

  updateCalendar: (
    id: string,
    payload: Partial<CreateCalendarPayload & { isVisible: boolean }>,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<CalendarDTO>> =>
    apiClient.patch<ApiDataResponse<CalendarDTO>>(
      ENDPOINTS.CALENDAR.CALENDAR_BY_ID(id),
      payload,
      config,
    ),

  deleteCalendar: (id: string, config?: RequestConfig): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(ENDPOINTS.CALENDAR.CALENDAR_BY_ID(id), config),

  // Events
  getEvents: (config?: RequestConfig): Promise<ApiListDataResponse<CalendarEventDTO>> =>
    apiClient.get<ApiListDataResponse<CalendarEventDTO>>(ENDPOINTS.CALENDAR.EVENTS, config),

  createEvent: (
    payload: CreateCalendarEventPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<CalendarEventDTO>> =>
    apiClient.post<ApiDataResponse<CalendarEventDTO>>(ENDPOINTS.CALENDAR.EVENTS, payload, config),

  updateEvent: (
    id: string,
    payload: UpdateCalendarEventPayload,
    config?: RequestConfig,
  ): Promise<ApiDataResponse<CalendarEventDTO>> =>
    apiClient.patch<ApiDataResponse<CalendarEventDTO>>(
      ENDPOINTS.CALENDAR.EVENT_BY_ID(id),
      payload,
      config,
    ),

  deleteEvent: (id: string, config?: RequestConfig): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(ENDPOINTS.CALENDAR.EVENT_BY_ID(id), config),
};

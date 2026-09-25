import { apiClient } from '@/api/client';

export type Bucket = 'study' | 'other';
export type Kind = 'fixed' | 'flexible';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type Energy = 'high' | 'medium' | 'low';
export type RevisionStage = 1 | 4 | 7;

export interface Revision {
  stage: RevisionStage;
}

export interface Block {
  id: string;
  start: number; // decimal hour, e.g. 9.5 = 9:30
  duration: number; // minutes
  label: string;
  bucket: Bucket;
  kind: Kind;
  subject: string | null;
  priority: Priority | null;
  energy: Energy | null;
  revision: Revision | null;
  groupId: string | null;
  completed: boolean;
  taskId?: string | null;
  calendarEventId?: string | null;
}

export interface DayData {
  sleepStart?: number;
  sleepEnd?: number;
  blocks: Block[];
}

export type DaysData = Record<string, DayData>;

export interface PlannerResponse {
  success: boolean;
  data: {
    daysData: DaysData;
    updatedAt?: string | null;
  };
}

export const plannerService = {
  async fetchPlanner(): Promise<DaysData> {
    const res = await apiClient.get<PlannerResponse>('/planner');
    const data = res?.data || res;
    return (data as any)?.daysData || {};
  },

  async fetchWeek(start: string): Promise<DaysData> {
    const res = await apiClient.get<PlannerResponse>(`/planner/week?start=${encodeURIComponent(start)}`);
    const data = res?.data || res;
    return (data as any)?.daysData || {};
  },

  async savePlanner(daysData: DaysData): Promise<DaysData> {
    const res = await apiClient.put<PlannerResponse>('/planner', { daysData });
    const data = res?.data || res;
    return (data as any)?.daysData || daysData;
  },

  async saveDay(key: string, dayData: DayData): Promise<DayData> {
    const res = await apiClient.put<any>(`/planner/day/${encodeURIComponent(key)}`, { dayData });
    const data = res?.data || res;
    return (data as any)?.dayData || dayData;
  },
};

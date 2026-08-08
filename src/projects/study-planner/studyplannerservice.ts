import { apiClient } from '../../api/client';

export interface StudySession {
  id: string;
  topic: string;
  moduleName: string;
  scheduledTime: string;
  durationMinutes: number;
  completed: boolean;
}

export const studyPlannerService = {
  async getSessions(): Promise<StudySession[]> {
    try {
      const res = await apiClient.get<any>('/study-planner/sessions');
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  async addSession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
    const res = await apiClient.post<any>('/study-planner/sessions', session);
    return res?.data || res;
  },

  async toggleComplete(id: string): Promise<StudySession> {
    const res = await apiClient.patch<any>(`/study-planner/sessions/${id}/toggle`);
    return res?.data || res;
  },
};


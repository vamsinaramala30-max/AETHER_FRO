export interface StudySession {
  id: string;
  topic: string;
  moduleName: string;
  scheduledTime: string;
  durationMinutes: number;
  completed: boolean;
}

const mockSessions: StudySession[] = [
  {
    id: 's1',
    topic: 'TCP/IP Handshake & Deep Socket Layer Tuning',
    moduleName: 'Network Architecture',
    scheduledTime: '2026-07-21T10:00',
    durationMinutes: 90,
    completed: false,
  },
  {
    id: 's2',
    topic: 'Concurrency Primitives & Channel Sync in Go',
    moduleName: 'Distributed Systems',
    scheduledTime: '2026-07-22T14:30',
    durationMinutes: 60,
    completed: true,
  },
];

import { apiClient } from '../../api/client';

export const studyPlannerService = {
  async getSessions(): Promise<StudySession[]> {
    try {
      return await apiClient.get<StudySession[]>('/study-planner/sessions');
    } catch {
      return [...mockSessions];
    }
  },

  async addSession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
    try {
      return await apiClient.post<StudySession>('/study-planner/sessions', session);
    } catch {
      const newSession: StudySession = { ...session, id: `session_${String(Date.now())}` };
      mockSessions.push(newSession);
      return newSession;
    }
  },

  async toggleComplete(id: string): Promise<StudySession> {
    try {
      return await apiClient.patch<StudySession>(`/study-planner/sessions/${id}/toggle`);
    } catch {
      const session = mockSessions.find((s) => s.id === id);
      if (!session) {
        throw new Error('Session not found');
      }
      session.completed = !session.completed;
      return { ...session };
    }
  },
};

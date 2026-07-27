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

export const studyPlannerService = {
  getSessions(): Promise<StudySession[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([...mockSessions]);
      }, 300),
    );
  },
  addSession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
    return new Promise((resolve) => {
      const newSession: StudySession = { ...session, id: `session_${String(Date.now())}` };
      mockSessions.push(newSession);
      setTimeout(() => {
        resolve(newSession);
      }, 250);
    });
  },
  toggleComplete(id: string): Promise<StudySession> {
    return new Promise((resolve, reject) => {
      const session = mockSessions.find((s) => s.id === id);
      if (!session) {
        reject(new Error('Session not found'));
        return;
      }
      session.completed = !session.completed;
      setTimeout(() => {
        resolve({ ...session });
      }, 200);
    });
  },
};

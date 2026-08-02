export interface RecentProject {
  id: string;
  name: string;
  repository: string;
  lastModified: string;
  branch: string;
  completionPercentage: number;
}

export interface RecentConversation {
  id: string;
  title: string;
  context: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ContinueWorkingData {
  projects: RecentProject[];
  conversations: RecentConversation[];
}

export async function fetchContinueWorkingData(): Promise<ContinueWorkingData> {
  return {
    projects: [
      {
        id: 'proj-1',
        name: 'Royal Resume Builder v5',
        repository: 'frontend/royal-resume',
        lastModified: '15 minutes ago',
        branch: 'feature/pdf-export-v2',
        completionPercentage: 85,
      },
      {
        id: 'proj-2',
        name: 'Auth Gateway microservice',
        repository: 'services/auth-gateway',
        lastModified: '3 hours ago',
        branch: 'main',
        completionPercentage: 100,
      },
    ],
    conversations: [
      {
        id: 'conv-1',
        title: 'React 19 Migration Q&A',
        context: '#frontend-architecture',
        lastMessageAt: '8 mins ago',
        unreadCount: 2,
      },
      {
        id: 'conv-2',
        title: 'DB Schema Review for Billing Engine',
        context: 'Direct Message with @db-team',
        lastMessageAt: '1 hour ago',
        unreadCount: 0,
      },
    ],
  };
}

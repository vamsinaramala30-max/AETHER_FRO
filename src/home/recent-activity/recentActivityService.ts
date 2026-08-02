export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'commit' | 'comment' | 'deploy' | 'issue' | 'approval';
}

export async function fetchRecentActivities(): Promise<ActivityItem[]> {
  return [
    {
      id: 'act-1',
      user: { name: 'Sarah Chen' },
      action: 'merged pull request',
      target: 'PR #104: Add WebSockets for Live Status',
      timestamp: '12 mins ago',
      type: 'commit',
    },
    {
      id: 'act-2',
      user: { name: 'Automated CI Pipeline' },
      action: 'deployed build to',
      target: 'Staging Environment (v2.4.0-rc1)',
      timestamp: '35 mins ago',
      type: 'deploy',
    },
    {
      id: 'act-3',
      user: { name: 'Michael Scott' },
      action: 'approved requirement spec for',
      target: 'User Onboarding Flow v3',
      timestamp: '2 hours ago',
      type: 'approval',
    },
    {
      id: 'act-4',
      user: { name: 'Alex Mercer' },
      action: 'commented on issue',
      target: '#892: Memory leak in worker thread',
      timestamp: '4 hours ago',
      type: 'comment',
    },
  ];
}

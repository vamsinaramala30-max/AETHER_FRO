export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'billing' | 'security' | 'team';
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  return [
    {
      id: 'notif-1',
      title: 'Security Alert',
      message: 'New login detected from IP 192.168.1.102 in San Jose, CA',
      createdAt: '10m ago',
      isRead: false,
      priority: 'high',
      category: 'security',
    },
    {
      id: 'notif-2',
      title: 'Weekly Automated Backup Succeeded',
      message: 'Database backup compressed and uploaded to encrypted cold storage',
      createdAt: '1h ago',
      isRead: false,
      priority: 'low',
      category: 'system',
    },
    {
      id: 'notif-3',
      title: 'Team Mention',
      message: 'Jessica tagged you in "Sprint 25 Architecture Specs"',
      createdAt: '3h ago',
      isRead: true,
      priority: 'medium',
      category: 'team',
    },
  ];
}

export async function markNotificationAsRead(_id: string): Promise<boolean> {
  return true;
}

export async function deleteNotification(_id: string): Promise<boolean> {
  return true;
}

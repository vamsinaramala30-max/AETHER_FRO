export interface HomeMetaData {
  userDisplayName: string;
  greeting: string;
  lastLogin: string;
  systemStatus: 'healthy' | 'degraded' | 'maintenance';
}

export interface GlobalHomeStats {
  activeProjectsCount: number;
  completedTasksToday: number;
  pendingReviewsCount: number;
  unreadNotificationsCount: number;
}

export async function fetchHomeMetaData(): Promise<HomeMetaData> {
  const currentHour = new Date().getHours();
  let greeting = 'Good evening';
  if (currentHour < 12) greeting = 'Good morning';
  else if (currentHour < 18) greeting = 'Good afternoon';

  return {
    userDisplayName: 'User',
    greeting: greeting,
    lastLogin: new Date().toISOString(),
    systemStatus: 'healthy',
  };
}

export async function fetchGlobalHomeStats(): Promise<GlobalHomeStats> {
  return {
    activeProjectsCount: 8,
    completedTasksToday: 14,
    pendingReviewsCount: 3,
    unreadNotificationsCount: 5,
  };
}
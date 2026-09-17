import { taskService } from '../projects/tasks/taskservice';
import { apiClient } from '../api/client';

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
  let activeProjects = 0;
  let completedTasks = 0;

  try {
    const projRes = await apiClient.get<any>('/projects');
    const projs = Array.isArray(projRes) ? projRes : projRes?.data || [];
    activeProjects = Array.isArray(projs) ? projs.length : 0;
  } catch {
    activeProjects = 0;
  }

  try {
    const tasks = await taskService.getTasks();
    if (Array.isArray(tasks)) {
      completedTasks = tasks.filter((t) => t.status === 'done').length;
    }
  } catch {
    completedTasks = 0;
  }

  return {
    activeProjectsCount: activeProjects,
    completedTasksToday: completedTasks,
    pendingReviewsCount: 0,
    unreadNotificationsCount: 0,
  };
}

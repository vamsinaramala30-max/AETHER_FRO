export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'Strategic' | 'Operational' | 'Skill' | 'Personal';
  progress: number;
  targetDate: string;
  milestones: Milestone[];
}

export interface GoalAnalyticsSummary {
  activeGoals: number;
  completedGoals: number;
  successRate: number;
  goals: GoalItem[];
  progressTrend: Array<{ period: string; completed: number; inProgress: number }>;
}

import { apiClient } from '../../api/client';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'Strategic' | 'Operational' | 'Skill' | 'Personal';
  progress: number;
  targetDate: string;
  milestones: Milestone[];
}

export interface GoalAnalyticsSummary {
  activeGoals: number;
  completedGoals: number;
  successRate: number;
  goals: GoalItem[];
  progressTrend: Array<{ period: string; completed: number; inProgress: number }>;
}

export const fetchGoalAnalytics = async (): Promise<GoalAnalyticsSummary> => {
  try {
    const res = await apiClient.get<any>('/analytics/goals');
    if (res?.data) return res.data;
    if (res && typeof res.activeGoals === 'number') return res;
  } catch {
    // Fall back to empty state
  }

  return {
    activeGoals: 0,
    completedGoals: 0,
    successRate: 0,
    goals: [],
    progressTrend: [],
  };
};


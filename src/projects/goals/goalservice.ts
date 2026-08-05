import { apiClient } from '../../api/client';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0 to 100
  category: 'technical' | 'career' | 'personal';
  metrics: string;
}

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    try {
      const res = await apiClient.get<any>('/goals');
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      return items;
    } catch {
      return [];
    }
  },

  async createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    const res = await apiClient.post<any>('/goals', goal);
    return res?.data || res;
  },

  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const res = await apiClient.patch<any>(`/goals/${id}/progress`, { progress });
    return res?.data || res;
  },
};


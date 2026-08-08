import { apiClient } from '../../api/client';

export interface WeeklyReviewData {
  weekEnding: string;
  tasksCompleted: number;
  hoursFocused: number;
  goalsAdvanced: number;
  insights: string[];
  blockers: string[];
}

export const weeklyReviewService = {
  async getLatestReview(): Promise<WeeklyReviewData> {
    try {
      const res = await apiClient.get<any>('/analytics/weekly-review');
      return (
        res?.data ||
        res || {
          weekEnding: new Date().toISOString().split('T')[0],
          tasksCompleted: 0,
          hoursFocused: 0,
          goalsAdvanced: 0,
          insights: [],
          blockers: [],
        }
      );
    } catch {
      return {
        weekEnding: new Date().toISOString().split('T')[0],
        tasksCompleted: 0,
        hoursFocused: 0,
        goalsAdvanced: 0,
        insights: [],
        blockers: [],
      };
    }
  },
};

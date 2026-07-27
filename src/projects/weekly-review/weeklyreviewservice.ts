export interface WeeklyReviewData {
  weekEnding: string;
  tasksCompleted: number;
  hoursFocused: number;
  goalsAdvanced: number;
  insights: string[];
  blockers: string[];
}

const mockReviewData: WeeklyReviewData = {
  weekEnding: '2026-07-19',
  tasksCompleted: 14,
  hoursFocused: 38.5,
  goalsAdvanced: 3,
  insights: [
    'Webpack-to-Vite migration cut HMR delay by 85%.',
    'Morning execution blocks yield 40% higher structural code clarity than evening stretches.',
  ],
  blockers: ['Upstream API schema synchronization delay slowed down task integration.'],
};

export const weeklyReviewService = {
  async getLatestReview(): Promise<WeeklyReviewData> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ ...mockReviewData });
      }, 500),
    );
  },
};

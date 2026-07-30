export interface ProductivityDataPoint {
  date: string;
  score: number;
  completedTasks: number;
  pendingTasks: number;
  deepWorkHours: number;
}

export interface ProductivitySummary {
  score: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  deepWorkSessions: number;
  focusHours: number;
  trend: ProductivityDataPoint[];
}

export const fetchProductivityData = async (preset: string): Promise<ProductivitySummary> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const days = preset === '7d' ? 7 : preset === '30d' ? 14 : 30;
  const trend: ProductivityDataPoint[] = Array.from({ length: days }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - idx - 1));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.floor(65 + Math.random() * 30),
      completedTasks: Math.floor(5 + Math.random() * 10),
      pendingTasks: Math.floor(1 + Math.random() * 5),
      deepWorkHours: Number((2 + Math.random() * 4).toFixed(1)),
    };
  });

  const totalCompleted = trend.reduce((acc, curr) => acc + curr.completedTasks, 0);
  const totalPending = trend.reduce((acc, curr) => acc + curr.pendingTasks, 0);
  const totalFocus = trend.reduce((acc, curr) => acc + curr.deepWorkHours, 0);

  return {
    score: 88,
    completedTasks: totalCompleted,
    pendingTasks: totalPending,
    completionRate: Number(((totalCompleted / (totalCompleted + totalPending)) * 100).toFixed(1)),
    deepWorkSessions: Math.round(trend.length * 1.5),
    focusHours: Number(totalFocus.toFixed(1)),
    trend,
  };
};
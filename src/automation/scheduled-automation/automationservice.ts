import { apiClient } from '../../api/client';

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  targetEndpoint: string;
  isActive: boolean;
  lastExecutionStatus?: 'success' | 'failure';
  lastRun?: string;
}

export const automationService = {
  async getTasks(): Promise<ScheduledTask[]> {
    try {
      const res = await apiClient.get<any>('/automation/tasks');
      let raw: any[] = [];
      if (Array.isArray(res)) raw = res;
      else if (res && Array.isArray(res.data)) raw = res.data;
      else if (res && Array.isArray(res.tasks)) raw = res.tasks;

      return raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        cronExpression: item.cronExpression || item.schedule || '0 * * * *',
        targetEndpoint: item.targetEndpoint || item.target || '/v1/tasks',
        isActive:
          item.isActive !== undefined
            ? Boolean(item.isActive)
            : item.status === 'active' || Boolean(item.isEnabled),
        lastExecutionStatus: item.lastExecutionStatus || 'success',
        lastRun: item.lastRun || item.lastRunAt,
      }));
    } catch {
      return [];
    }
  },

  async toggleTask(id: string): Promise<ScheduledTask> {
    const res = await apiClient.patch<any>(`/automation/tasks/${id}/toggle`);
    return res?.data || res;
  },

  async createTask(
    task: Omit<ScheduledTask, 'id' | 'lastExecutionStatus' | 'lastRun'>,
  ): Promise<ScheduledTask> {
    const res = await apiClient.post<any>('/automation/tasks', task);
    return res?.data || res;
  },
};

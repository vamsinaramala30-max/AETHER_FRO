import { automationApi } from '../automation-api';
import { ExecutionLog } from '../automation-types';
import { triggerActivityUpdate } from '@/shared/activityEvents';

export class AutomationExecutionService {
  public async executeRule(id: string): Promise<{ success: boolean; executionId: string }> {
    const res = await automationApi.executeAutomation(id);
    triggerActivityUpdate();
    return res;
  }

  public async fetchLogs(query?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: ExecutionLog[]; totalPages: number; total: number }> {
    return automationApi.getActivityLogs(query);
  }
}

export const automationExecutionService = new AutomationExecutionService();

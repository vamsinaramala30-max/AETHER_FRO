import { automationApi } from '../automation-api';
import { ExecutionLog } from '../automation-types';

export class AutomationExecutionService {
  public async executeRule(id: string): Promise<{ success: boolean; executionId: string }> {
    return automationApi.executeAutomation(id);
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

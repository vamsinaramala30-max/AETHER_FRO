import { automationApi, WorkflowDTO, WorkflowExecutionResultDTO } from '../api';

export class AutomationService {
  public async listWorkflows(): Promise<WorkflowDTO[]> {
    return automationApi.getWorkflows();
  }

  public async runWorkflow(id: string, payload?: Record<string, unknown>): Promise<WorkflowExecutionResultDTO> {
    return automationApi.executeWorkflow(id, payload);
  }
}

export const automationService = new AutomationService();
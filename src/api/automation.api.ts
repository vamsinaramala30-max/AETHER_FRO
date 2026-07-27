import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface WorkflowDTO {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  createdAt: string;
}

export interface WorkflowExecutionResultDTO {
  executionId: string;
  status: 'success' | 'failed';
  startedAt: string;
  finishedAt: string;
}

export const automationApi = {
  getWorkflows: (config?: RequestConfig): Promise<WorkflowDTO[]> =>
    apiClient.get<WorkflowDTO[]>(ENDPOINTS.AUTOMATION.WORKFLOWS, config),

  executeWorkflow: (
    id: string,
    payload?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<WorkflowExecutionResultDTO> =>
    apiClient.post<WorkflowExecutionResultDTO>(ENDPOINTS.AUTOMATION.EXECUTE(id), payload, config),
};

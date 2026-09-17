import { apiClient, RequestConfig } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { AutomationRule, ExecutionLog } from './automation-types';

export interface CreateAutomationDTO {
  name: string;
  description?: string;
  trigger: string;
  schedule?: string;
  steps?: any[];
  actions?: any;
  conditions?: any[];
  isEnabled?: boolean;
}

export interface UpdateAutomationDTO {
  name?: string;
  description?: string;
  trigger?: string;
  schedule?: string;
  steps?: any[];
  actions?: any;
  conditions?: any[];
  isEnabled?: boolean;
  status?: string;
}

export const automationApi = {
  getAutomations: async (config?: RequestConfig): Promise<AutomationRule[]> => {
    try {
      const res = await apiClient.get<any>(ENDPOINTS.AUTOMATION.WORKFLOWS, config);
      const rawList = Array.isArray(res) ? res : (res?.data ?? []);
      return rawList.map((item: any) => ({
        id: item.id,
        name: item.name || 'Untitled Automation',
        description: item.description || '',
        status:
          item.isEnabled === false || item.status === 'PAUSED' || item.status === 'paused'
            ? 'paused'
            : item.status?.toLowerCase() || 'active',
        trigger: item.trigger || 'SCHEDULE',
        triggerConfig: item.triggerConfig || {},
        schedule: item.schedule || null,
        steps: Array.isArray(item.steps)
          ? item.steps
          : Array.isArray(item.actions)
            ? item.actions
            : [],
        actions: item.actions || {},
        conditions: item.conditions || [],
        lastRunAt: item.lastRunAt || null,
        lastRunStatus: item.lastRunStatus || 'success',
        runCount: item.runCount || 0,
        successRate: item.successRate ?? 100,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },

  getAutomationById: async (id: string, config?: RequestConfig): Promise<AutomationRule | null> => {
    try {
      const res = await apiClient.get<any>(ENDPOINTS.AUTOMATION.WORKFLOW_BY_ID(id), config);
      const item = res?.data ?? res;
      if (!item) return null;
      return {
        id: item.id || id,
        name: item.name || 'Automation',
        description: item.description || '',
        status: item.isEnabled === false ? 'paused' : item.status?.toLowerCase() || 'active',
        trigger: item.trigger || 'SCHEDULE',
        triggerConfig: item.triggerConfig || {},
        schedule: item.schedule || null,
        steps: Array.isArray(item.steps) ? item.steps : [],
        actions: item.actions || {},
        conditions: item.conditions || [],
        lastRunAt: item.lastRunAt || null,
        lastRunStatus: item.lastRunStatus || 'success',
        runCount: item.runCount || 0,
        successRate: item.successRate ?? 100,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  parseIntent: async (prompt: string, config?: RequestConfig): Promise<any> => {
    try {
      const res = await apiClient.post<any>('/automation/parse-intent', { prompt }, config);
      return res?.data ?? res;
    } catch (err: any) {
      return {
        supported: false,
        unsupportedReason: err?.message || 'Failed to parse automation prompt.',
      };
    }
  },

  getStats: async (config?: RequestConfig): Promise<any> => {
    try {
      const res = await apiClient.get<any>('/automation/stats', config);
      return res?.data ?? res;
    } catch {
      return null;
    }
  },

  createAutomation: async (
    dto: CreateAutomationDTO,
    config?: RequestConfig,
  ): Promise<AutomationRule> => {
    const payload = {
      name: dto.name,
      description: dto.description || '',
      trigger: dto.trigger,
      schedule: dto.schedule,
      actions: dto.steps || dto.actions || [],
      isEnabled: dto.isEnabled !== undefined ? dto.isEnabled : true,
    };
    const res = await apiClient.post<any>('/automation', payload, config);
    const item = res?.data ?? res;
    return {
      id: item?.id || `auto-${Date.now()}`,
      name: item?.name || dto.name,
      description: item?.description || dto.description || '',
      status: item?.status?.toLowerCase() || 'active',
      trigger: item?.trigger || dto.trigger,
      schedule: item?.schedule || dto.schedule,
      steps: dto.steps || [],
      runCount: item?.runCount || 0,
      successRate: 100,
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: item?.updatedAt || new Date().toISOString(),
    };
  },

  updateAutomation: async (
    id: string,
    dto: UpdateAutomationDTO,
    config?: RequestConfig,
  ): Promise<AutomationRule> => {
    const payload = {
      name: dto.name,
      description: dto.description,
      trigger: dto.trigger,
      schedule: dto.schedule,
      isEnabled: dto.isEnabled !== undefined ? dto.isEnabled : dto.status === 'active',
      actions: dto.steps || dto.actions,
    };
    const res = await apiClient.patch<any>(`/automation/${id}`, payload, config);
    const item = res?.data ?? res;
    return {
      id: item?.id || id,
      name: item?.name || dto.name || 'Automation',
      description: item?.description || dto.description || '',
      status: item?.isEnabled === false || item?.status === 'PAUSED' ? 'paused' : 'active',
      trigger: item?.trigger || dto.trigger || 'SCHEDULE',
      schedule: item?.schedule || dto.schedule,
      steps: dto.steps || [],
      runCount: item?.runCount || 0,
      successRate: item?.successRate ?? 100,
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: item?.updatedAt || new Date().toISOString(),
    };
  },

  deleteAutomation: async (id: string, config?: RequestConfig): Promise<boolean> => {
    try {
      await apiClient.delete(`/automation/${id}`, config);
      return true;
    } catch {
      return true;
    }
  },

  executeAutomation: async (
    id: string,
    config?: RequestConfig,
  ): Promise<{ success: boolean; executionId: string; result?: any }> => {
    const res = await apiClient.post<any>(ENDPOINTS.AUTOMATION.EXECUTE(id), {}, config);
    const data = res?.data ?? res;
    return {
      success: true,
      executionId: data?.executionId || `exec-${Date.now()}`,
      result: data?.result || data,
    };
  },

  getActivityLogs: async (
    query?: { search?: string; status?: string; page?: number; limit?: number },
    config?: RequestConfig,
  ): Promise<{ logs: ExecutionLog[]; totalPages: number; total: number }> => {
    try {
      const params: Record<string, string | number | undefined> = {
        search: query?.search,
        status: query?.status !== 'ALL' ? query?.status : undefined,
        page: query?.page || 1,
        limit: query?.limit || 20,
      };
      const res = await apiClient.get<any>('/automation/logs', { ...config, params });
      const rawLogs = res?.logs || res?.data || [];
      const pagination = res?.pagination || {};

      const logs: ExecutionLog[] = rawLogs.map((l: any) => ({
        id: l.id || `log-${Math.random().toString(36).substring(2, 7)}`,
        automationId: l.automationId || 'auto-1',
        automationName: l.automationName || l.message || 'Automation Action',
        status:
          (l.status?.toLowerCase() === 'success' || l.type?.includes('COMPLETED')
            ? 'completed'
            : l.status?.toLowerCase()) || 'completed',
        trigger: l.trigger || 'Automation Event',
        executedBy: l.executedBy || 'Aether Engine',
        startedAt: l.createdAt || l.startedAt || new Date().toISOString(),
        completedAt: l.completedAt || l.createdAt,
        duration: l.duration || '0.5s',
        stepLogs: Array.isArray(l.stepLogs) ? l.stepLogs : [],
        resultSummary: l.message || l.resultSummary || 'Action completed successfully',
        userFriendlyError:
          l.errorMessage || (l.status === 'FAILED' ? 'Execution step failed' : null),
      }));

      return {
        logs,
        totalPages: pagination.totalPages || 1,
        total: pagination.total || logs.length,
      };
    } catch {
      return { logs: [], totalPages: 1, total: 0 };
    }
  },
};

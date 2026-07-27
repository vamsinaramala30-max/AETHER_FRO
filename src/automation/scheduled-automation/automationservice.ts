// frontend/src/automation/scheduled-automation/automationService.ts

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  targetEndpoint: string;
  isActive: boolean;
  lastExecutionStatus?: 'success' | 'failure';
  lastRun?: string;
}

const mockTasks: ScheduledTask[] = [
  {
    id: 'sched-1',
    name: 'Database Image Purge Routine',
    cronExpression: '0 4 * * *',
    targetEndpoint: '/v1/tasks/db-cleanup',
    isActive: true,
    lastExecutionStatus: 'success',
    lastRun: '2026-07-20T04:00:00Z',
  },
  {
    id: 'sched-2',
    name: 'Operational Usage Indexing',
    cronExpression: '0 */2 * * *',
    targetEndpoint: '/v1/tasks/metrics-index',
    isActive: true,
    lastExecutionStatus: 'success',
    lastRun: '2026-07-20T20:00:00Z',
  },
  {
    id: 'sched-3',
    name: 'Telemetry Archive Dispatch',
    cronExpression: '0 0 * * 0',
    targetEndpoint: '/v1/tasks/send-telemetry',
    isActive: false,
    lastExecutionStatus: 'failure',
    lastRun: '2026-07-19T00:01:22Z',
  },
];

export const automationService = {
  async getTasks(): Promise<ScheduledTask[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockTasks]);
      }, 250);
    });
  },

  async toggleTask(id: string): Promise<ScheduledTask> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockTasks.findIndex((t) => t.id === id);
        if (idx === -1) {
          reject(new Error('Target cron frame task target missing.'));
          return;
        }
        mockTasks[idx] = { ...mockTasks[idx], isActive: !mockTasks[idx].isActive };
        resolve({ ...mockTasks[idx] });
      }, 200);
    });
  },

  async createTask(
    task: Omit<ScheduledTask, 'id' | 'lastExecutionStatus' | 'lastRun'>,
  ): Promise<ScheduledTask> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: ScheduledTask = {
          ...task,
          id: `sched-${Date.now()}`,
        };
        mockTasks.push(newTask);
        resolve(newTask);
      }, 300);
    });
  },
};

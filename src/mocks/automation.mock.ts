export interface MockWorkflow {
  id: string;
  name: string;
  trigger: 'cron' | 'webhook' | 'manual';
  enabled: boolean;
}

export const mockWorkflows: MockWorkflow[] = [
  { id: 'wf_1', name: 'Auto-Trigger AI Summarization', trigger: 'webhook', enabled: true },
  { id: 'wf_2', name: 'Daily Performance Telemetry Dump', trigger: 'cron', enabled: true },
];

import { BaseEntity, ID } from './common';

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'failed';

export interface WorkflowStep {
  id: ID;
  name: string;
  type: string;
  config: Record<string, unknown>;
}

export interface Workflow extends BaseEntity {
  name: string;
  description?: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  lastExecutedAt?: string;
}
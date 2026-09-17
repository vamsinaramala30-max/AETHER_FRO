/**
 * Core type definitions for Aether OS Automation engine
 */

export type AutomationStatus = 'active' | 'paused' | 'draft' | 'failed';

export type TriggerType =
  | 'SCHEDULE'
  | 'CALENDAR_EVENT'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_OVERDUE'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'GOAL_UPDATED'
  | 'DOCUMENT_CREATED'
  | 'DOCUMENT_UPDATED'
  | 'FILE_UPLOADED'
  | 'AI_EVENT'
  | 'AGENT_EVENT'
  | 'MANUAL';

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'exists'
  | 'is_empty'
  | 'greater_than'
  | 'less_than'
  | 'AND'
  | 'OR'
  | 'NOT';

export type AIActionType =
  'ASK_AETHER' | 'SUMMARIZE' | 'ANALYZE' | 'CLASSIFY' | 'GENERATE' | 'EXTRACT' | 'TRANSFORM';

export type SystemActionType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'COMPLETE_TASK'
  | 'CREATE_PROJECT'
  | 'UPDATE_PROJECT'
  | 'UPDATE_GOAL'
  | 'CREATE_CALENDAR_EVENT'
  | 'CREATE_REMINDER'
  | 'CREATE_KNOWLEDGE_ITEM'
  | 'SAVE_AI_RESPONSE'
  | 'ORGANIZE_DOCUMENT'
  | 'ORGANIZE_FILE'
  | 'RUN_SUPPORTED_AGENT'
  | 'CREATE_NOTIFICATION';

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
}

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'ai_action' | 'action' | 'schedule';
  title: string;
  subtitle?: string;
  triggerType?: TriggerType;
  aiActionType?: AIActionType;
  actionType?: SystemActionType;
  config: Record<string, any>;
  conditions?: WorkflowCondition[];
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  status: AutomationStatus;
  trigger: TriggerType | string;
  triggerConfig?: Record<string, any>;
  schedule?: string;
  steps: WorkflowStep[];
  actions?: Record<string, any> | WorkflowStep[];
  conditions?: WorkflowCondition[];
  lastRunAt?: string | null;
  lastRunStatus?: 'success' | 'failed' | 'running' | null;
  runCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus = 'running' | 'completed' | 'failed' | 'cancelled' | 'needs_attention';

export interface StepExecutionLog {
  stepId: string;
  stepTitle: string;
  stepType: string;
  status: 'completed' | 'failed' | 'skipped';
  startedAt: string;
  completedAt: string;
  durationMs: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
}

export interface ExecutionLog {
  id: string;
  automationId: string;
  automationName: string;
  status: ExecutionStatus;
  trigger: string;
  executedBy: string;
  startedAt: string;
  completedAt?: string | null;
  duration?: string;
  stepLogs: StepExecutionLog[];
  resultSummary?: string;
  userFriendlyError?: string | null;
}

export type TemplateCategory = 'Productivity' | 'Projects' | 'Tasks' | 'Knowledge' | 'AI';

export interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  badge?: string;
  iconName: string;
  popularity: number;
  estimatedTimeSaved: string;
  preset: {
    name: string;
    description: string;
    trigger: TriggerType;
    schedule?: string;
    steps: WorkflowStep[];
  };
}

export interface AutomationStatsSummary {
  totalAutomations: number;
  activeCount: number;
  pausedCount: number;
  failedCount: number;
  totalExecutions: number;
  successRate: number;
  timeSavedHours: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Attention Required';
}

export interface AutomationFilterOptions {
  searchQuery: string;
  status: 'ALL' | AutomationStatus;
  category?: string;
}

export interface ActivityFilterOptions {
  searchQuery: string;
  status: 'ALL' | ExecutionStatus;
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

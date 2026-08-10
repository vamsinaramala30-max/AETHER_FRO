import { z } from 'zod';

export const conditionSchema = z.object({
  id: z.string(),
  field: z.string().min(1, 'Field name is required'),
  operator: z.enum([
    'equals',
    'not_equals',
    'contains',
    'exists',
    'is_empty',
    'greater_than',
    'less_than',
    'AND',
    'OR',
    'NOT',
  ]),
  value: z.string(),
});

export const workflowStepSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'condition', 'ai_action', 'action', 'schedule']),
  title: z.string().min(1, 'Step title is required'),
  subtitle: z.string().optional(),
  triggerType: z.string().optional(),
  aiActionType: z.string().optional(),
  actionType: z.string().optional(),
  config: z.record(z.string(), z.any()),
  conditions: z.array(conditionSchema).optional(),
});

export const workflowSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  trigger: z.string().min(1, 'Primary trigger is required'),
  schedule: z.string().optional(),
  steps: z.array(workflowStepSchema).min(1, { message: 'Workflow must contain at least one step' }),
});

export type WorkflowSchemaType = z.infer<typeof workflowSchema>;

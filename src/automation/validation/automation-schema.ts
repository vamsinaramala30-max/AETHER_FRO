import { z } from 'zod';

export const automationSchema = z.object({
  name: z.string().min(1, 'Automation name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(300, 'Description must be 300 characters or less').optional(),
  trigger: z.string().min(1, 'Trigger is required'),
  schedule: z.string().optional(),
  isEnabled: z.boolean().default(true),
});

export type AutomationSchemaType = z.infer<typeof automationSchema>;

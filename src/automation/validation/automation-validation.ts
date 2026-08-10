import { automationSchema } from './automation-schema';
import { workflowSchema } from './workflow-schema';

export function validateAutomationInput(data: any): { success: boolean; errors?: Record<string, string> } {
  const result = automationSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { success: false, errors };
  }
  return { success: true };
}

export function validateWorkflowInput(data: any): { success: boolean; errors?: Record<string, string> } {
  const result = workflowSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { success: false, errors };
  }
  return { success: true };
}

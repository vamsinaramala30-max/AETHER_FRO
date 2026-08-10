// ============================================================================
// AETHER AI — Prompt Builder
// ============================================================================
// Builds prompts from templates by substituting variables.
// ============================================================================

import type { PromptTemplate, BuiltPrompt } from '../ai-types';

/**
 * Substitute variables in a prompt template string.
 */
export function substituteVariables(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return variables[key] ?? `{{${key}}}`;
  });
}

/**
 * Build a BuiltPrompt from a template and variable values.
 * Validates required variables are present.
 */
export function buildPrompt(
  template: PromptTemplate,
  variables: Record<string, string> = {},
): BuiltPrompt {
  // Check required variables
  for (const variable of template.variables) {
    if (variable.required && !variables[variable.name] && !variable.defaultValue) {
      // Missing required variable — use placeholder to avoid silent failure
      variables[variable.name] = `[${variable.name}]`;
    }
    // Apply default values
    if (!variables[variable.name] && variable.defaultValue) {
      variables[variable.name] = variable.defaultValue;
    }
  }

  const rendered = substituteVariables(template.template, variables);

  return {
    systemPrompt: rendered,
    templateId: template.id,
  };
}

/**
 * Preview a prompt template with placeholder variable values.
 */
export function previewPrompt(template: PromptTemplate): string {
  const placeholders: Record<string, string> = {};
  for (const variable of template.variables) {
    placeholders[variable.name] = variable.defaultValue ?? `[${variable.name}]`;
  }
  return substituteVariables(template.template, placeholders);
}

/**
 * Validate that all required variables are provided.
 */
export function validatePromptVariables(
  template: PromptTemplate,
  variables: Record<string, string>,
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const variable of template.variables) {
    if (variable.required && !variables[variable.name] && !variable.defaultValue) {
      missing.push(variable.name);
    }
  }
  return { valid: missing.length === 0, missing };
}

export const promptBuilder = {
  substituteVariables,
  buildPrompt,
  previewPrompt,
  validatePromptVariables,
};

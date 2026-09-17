// ============================================================================
// AETHER AI — Tool Router
// ============================================================================
// Routes tool execution requests to the correct tool category handler.
// The frontend does NOT execute tools — it routes requests to the backend.
// ============================================================================

import type { ToolExecutionRequest, ToolCategory, ToolDefinition } from '../ai-types';
import { toolRegistry } from './tool-registry';

export type ToolRoute = {
  toolId: string;
  category: ToolCategory;
  tool: ToolDefinition;
};

/**
 * Resolve a tool execution request to its tool definition.
 */
export function routeToolRequest(request: ToolExecutionRequest): ToolRoute | null {
  const tool = toolRegistry.getById(request.toolId);
  if (!tool) return null;
  if (!tool.enabled) return null;
  return { toolId: tool.id, category: tool.category, tool };
}

/**
 * Get all tools that can handle a given intent keyword.
 */
export function findToolsByKeyword(keyword: string): ToolDefinition[] {
  const lower = keyword.toLowerCase();
  return toolRegistry
    .getAll()
    .filter(
      (t) =>
        t.enabled &&
        (t.name.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower)),
    );
}

/**
 * Validate that a tool request has required parameters.
 */
export function validateToolArgs(
  tool: ToolDefinition,
  args: Record<string, unknown>,
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const param of tool.parameters) {
    if (param.required && args[param.name] === undefined) {
      missing.push(param.name);
    }
  }
  return { valid: missing.length === 0, missing };
}

export const toolRouter = {
  routeToolRequest,
  findToolsByKeyword,
  validateToolArgs,
};

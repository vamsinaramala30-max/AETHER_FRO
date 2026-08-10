// ============================================================================
// AETHER AI — Tool Executor (Frontend Request Layer)
// ============================================================================
// Sends tool execution requests to the AETHER backend.
// The frontend does NOT execute tool logic itself.
// The backend is responsible for authorization and actual execution.
// ============================================================================

import type { ToolExecutionRequest, ToolExecutionResult, AIResult } from '../ai-types';
import { DEFAULT_AI_CONFIG } from '../ai-config';
import { toolRouter } from './tool-router';

/**
 * Request the AETHER backend to execute a tool.
 * The frontend sends the request; the backend performs the execution.
 */
export async function executeToolRequest(
  request: ToolExecutionRequest,
): Promise<AIResult<ToolExecutionResult>> {
  // Route validation
  const route = toolRouter.routeToolRequest(request);
  if (!route) {
    return {
      success: false,
      error: {
        code: 'TOOL_FAILED',
        message: `Tool "${request.toolName}" is not available or is disabled.`,
        timestamp: Date.now(),
      },
    };
  }

  // Validate args
  const { valid, missing } = toolRouter.validateToolArgs(route.tool, request.args);
  if (!valid) {
    return {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: `Tool "${request.toolName}" is missing required parameters: ${missing.join(', ')}`,
        timestamp: Date.now(),
      },
    };
  }

  const url = `${DEFAULT_AI_CONFIG.backend.baseUrl}${DEFAULT_AI_CONFIG.backend.toolsPath}/execute`;
  const startedAt = Date.now();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool_id: request.toolId,
        args: request.args,
        conversation_id: request.conversationId,
        message_id: request.messageId,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      return {
        success: false,
        error: {
          code: 'TOOL_FAILED',
          message: `Tool execution failed: HTTP ${res.status}`,
          timestamp: Date.now(),
        },
      };
    }

    const raw = await res.json() as {
      success?: boolean;
      result?: unknown;
      error?: string;
    };

    return {
      success: true,
      data: {
        toolId: request.toolId,
        success: raw.success !== false,
        result: raw.result,
        error: raw.error,
        durationMs: Date.now() - startedAt,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'TOOL_FAILED',
        message: 'Cannot reach the AETHER backend to execute tool.',
        timestamp: Date.now(),
      },
    };
  }
}

export const toolExecutor = { executeToolRequest };

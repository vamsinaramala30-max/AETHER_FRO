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

import { apiClient } from '../../api/client';

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

  const startedAt = Date.now();

  try {
    const res = await apiClient.post<Record<string, unknown>>(
      `${DEFAULT_AI_CONFIG.backend.toolsPath}/execute`,
      {
        toolName: request.toolName || request.toolId,
        tool_id: request.toolId,
        args: request.args,
        input: request.args,
        conversation_id: request.conversationId,
        message_id: request.messageId,
      },
      { timeout: 30_000 }
    );

    const raw = (res && typeof res === 'object') ? res : {};
    const dataObj = (typeof raw['data'] === 'object' && raw['data'] !== null)
      ? (raw['data'] as Record<string, unknown>)
      : raw;

    const isSuccess = raw['success'] !== false && dataObj['status'] !== 'FAILED';
    const output = dataObj['output'] ?? dataObj['result'] ?? raw['result'];
    const errorMsg = typeof dataObj['error'] === 'string'
      ? dataObj['error']
      : (typeof raw['error'] === 'string' ? raw['error'] : undefined);

    return {
      success: true,
      data: {
        toolId: request.toolId,
        success: isSuccess,
        result: output,
        error: errorMsg,
        durationMs: Date.now() - startedAt,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot reach the AETHER backend to execute tool.';
    return {
      success: false,
      error: {
        code: 'TOOL_FAILED',
        message,
        timestamp: Date.now(),
      },
    };
  }
}

export const toolExecutor = { executeToolRequest };

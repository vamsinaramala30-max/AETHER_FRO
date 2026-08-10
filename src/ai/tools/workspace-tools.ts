// ============================================================================
// AETHER AI — Workspace Tools
// ============================================================================
// Frontend definitions for workspace-level tools.
// ============================================================================

import type { ToolDefinition } from '../ai-types';

export const WORKSPACE_TOOLS: ToolDefinition[] = [
  {
    id: 'get_workspace_overview',
    name: 'Get Workspace Overview',
    description: 'Get an overview of the current workspace status',
    category: 'workspace',
    parameters: [],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'search_workspace',
    name: 'Search Workspace',
    description: 'Search across all workspace content',
    category: 'workspace',
    parameters: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      { name: 'types', type: 'array', description: 'Content types to search', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'get_recent_activity',
    name: 'Get Recent Activity',
    description: 'Get recent activity in the workspace',
    category: 'workspace',
    parameters: [
      { name: 'limit', type: 'number', description: 'Number of activities', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'get_user_context',
    name: 'Get User Context',
    description: 'Get context about the current user and their preferences',
    category: 'workspace',
    parameters: [],
    requiresAuth: true,
    enabled: true,
  },
];

export const workspaceTools = { WORKSPACE_TOOLS };

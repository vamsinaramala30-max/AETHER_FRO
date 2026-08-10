// ============================================================================
// AETHER AI — Task Tools
// ============================================================================
// Frontend definitions and request builders for task-related tools.
// ============================================================================

import type { ToolDefinition } from '../ai-types';

/**
 * Built-in task tool definitions (frontend declaration only).
 * The backend implements the actual tool logic.
 */
export const TASK_TOOLS: ToolDefinition[] = [
  {
    id: 'create_task',
    name: 'Create Task',
    description: 'Create a new task in the workspace',
    category: 'task',
    parameters: [
      { name: 'title', type: 'string', description: 'Task title', required: true },
      { name: 'description', type: 'string', description: 'Task description', required: false },
      { name: 'project_id', type: 'string', description: 'Project ID', required: false },
      { name: 'priority', type: 'string', description: 'Task priority', required: false, enum: ['low', 'medium', 'high', 'urgent'] },
      { name: 'due_date', type: 'string', description: 'Due date (ISO 8601)', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'list_tasks',
    name: 'List Tasks',
    description: 'List tasks from the workspace with optional filters',
    category: 'task',
    parameters: [
      { name: 'project_id', type: 'string', description: 'Filter by project', required: false },
      { name: 'status', type: 'string', description: 'Filter by status', required: false, enum: ['todo', 'in_progress', 'done', 'cancelled'] },
      { name: 'limit', type: 'number', description: 'Maximum number of tasks', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'update_task',
    name: 'Update Task',
    description: 'Update an existing task',
    category: 'task',
    parameters: [
      { name: 'task_id', type: 'string', description: 'Task ID', required: true },
      { name: 'title', type: 'string', description: 'New title', required: false },
      { name: 'status', type: 'string', description: 'New status', required: false, enum: ['todo', 'in_progress', 'done', 'cancelled'] },
      { name: 'priority', type: 'string', description: 'New priority', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
];

export const taskTools = { TASK_TOOLS };

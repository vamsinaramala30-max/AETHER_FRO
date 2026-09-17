// ============================================================================
// AETHER AI — Project Tools
// ============================================================================
// Frontend definitions for project-related tools.
// ============================================================================

import type { ToolDefinition } from '../ai-types';

export const PROJECT_TOOLS: ToolDefinition[] = [
  {
    id: 'list_projects',
    name: 'List Projects',
    description: 'List all projects in the workspace',
    category: 'project',
    parameters: [
      {
        name: 'status',
        type: 'string',
        description: 'Filter by status',
        required: false,
        enum: ['active', 'archived', 'completed'],
      },
      { name: 'limit', type: 'number', description: 'Maximum results', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'get_project',
    name: 'Get Project',
    description: 'Get details for a specific project',
    category: 'project',
    parameters: [{ name: 'project_id', type: 'string', description: 'Project ID', required: true }],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'create_project',
    name: 'Create Project',
    description: 'Create a new project in the workspace',
    category: 'project',
    parameters: [
      { name: 'name', type: 'string', description: 'Project name', required: true },
      { name: 'description', type: 'string', description: 'Project description', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'get_project_summary',
    name: 'Get Project Summary',
    description: 'Get a summary of project progress and tasks',
    category: 'project',
    parameters: [{ name: 'project_id', type: 'string', description: 'Project ID', required: true }],
    requiresAuth: true,
    enabled: true,
  },
];

export const projectTools = { PROJECT_TOOLS };

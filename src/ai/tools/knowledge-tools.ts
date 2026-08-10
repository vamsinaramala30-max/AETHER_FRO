// ============================================================================
// AETHER AI — Knowledge Tools
// ============================================================================
// Frontend definitions for knowledge base tools.
// ============================================================================

import type { ToolDefinition } from '../ai-types';

export const KNOWLEDGE_TOOLS: ToolDefinition[] = [
  {
    id: 'search_knowledge',
    name: 'Search Knowledge',
    description: 'Search the knowledge base for relevant documents',
    category: 'knowledge',
    parameters: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      { name: 'collection_id', type: 'string', description: 'Knowledge collection ID', required: false },
      { name: 'top_k', type: 'number', description: 'Number of results', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'list_documents',
    name: 'List Documents',
    description: 'List documents in the knowledge base',
    category: 'knowledge',
    parameters: [
      { name: 'collection_id', type: 'string', description: 'Collection ID', required: false },
      { name: 'status', type: 'string', description: 'Filter by status', required: false },
    ],
    requiresAuth: true,
    enabled: true,
  },
  {
    id: 'get_document',
    name: 'Get Document',
    description: 'Get details and content of a specific document',
    category: 'knowledge',
    parameters: [
      { name: 'document_id', type: 'string', description: 'Document ID', required: true },
    ],
    requiresAuth: true,
    enabled: true,
  },
];

export const knowledgeTools = { KNOWLEDGE_TOOLS };

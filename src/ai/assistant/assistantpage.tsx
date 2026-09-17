import React from 'react';
import { AIPage } from '../AIPage';

/**
 * AssistantPage — Authoritative Phase 10 AI Assistant entry point.
 * Delegates directly to the canonical AIPage, connecting the user to
 * the full Express backend, SSE streaming engine, PlanView, ToolExecution,
 * Memory and Knowledge panels, and server-authoritative state.
 */
export const AssistantPage: React.FC = () => {
  return <AIPage />;
};

export default AssistantPage;


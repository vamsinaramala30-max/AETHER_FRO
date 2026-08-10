// ============================================================================
// AETHER AI — AI.tsx (Main Feature Entry Component)
// ============================================================================

import React, { memo } from 'react';
import { AIPage } from './AIPage';

/**
 * AI — Top-level entry component for the AETHER AI feature.
 *
 * Provides the complete AETHER AI experience:
 * - Chat with AI assistant
 * - Conversation management
 * - Memory management
 * - Knowledge base (RAG)
 * - Prompt library
 * - Model selection
 * - Agent coordination
 *
 * The AI system communicates exclusively with the AETHER backend.
 * No cloud AI APIs are used. No API keys are stored on the frontend.
 */
export const AI = memo(() => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden" aria-label="AETHER AI">
      <AIPage />
    </div>
  );
});

AI.displayName = 'AI';

export default AI;

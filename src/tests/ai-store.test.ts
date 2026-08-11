import { describe, it, expect } from 'vitest';
import { useAIStore } from '../ai/ai-store';

describe('Zustand AI Store', () => {
  it('should set active conversation ID', () => {
    useAIStore.getState().setActiveConversationId('conv_test_123');
    expect(useAIStore.getState().activeConversationId).toBe('conv_test_123');
  });

  it('should append message to conversation', () => {
    useAIStore.getState().appendMessage('conv_test_123', {
      id: 'msg_1',
      conversationId: 'conv_test_123',
      role: 'user',
      content: 'Hello Aether',
      status: 'sent',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const msgs = useAIStore.getState().messages['conv_test_123'];
    expect(msgs).toBeDefined();
    expect(msgs.length).toBe(1);
    expect(msgs[0].content).toBe('Hello Aether');
  });

  it('should set pending confirmation state', () => {
    const conf = {
      actionId: 'act_1',
      toolName: 'delete_project',
      description: 'Confirm delete project',
      riskLevel: 'DESTRUCTIVE' as const,
      args: { id: 'p1' },
    };

    useAIStore.getState().setPendingConfirmation(conf);
    expect(useAIStore.getState().pendingConfirmation?.toolName).toBe('delete_project');

    useAIStore.getState().setPendingConfirmation(null);
    expect(useAIStore.getState().pendingConfirmation).toBeNull();
  });
});

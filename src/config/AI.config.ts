export interface AiConfig {
  defaultModel: string;
  supportedModels: string[];
  streaming: {
    enabled: boolean;
    typingDelayMs: number;
    chunkTimeoutMs: number;
  };
  limits: {
    maxPromptLength: number;
    maxContextTokens: number;
    maxHistoryMessages: number;
  };
  featureFlags: {
    enableReasoningMode: boolean;
    enableCodeExecution: boolean;
    enableMultimodalInputs: boolean;
  };
}

export const aiConfig: AiConfig = {
  defaultModel: 'aether-core-v1',
  supportedModels: [
    'aether-core-v1',
    'aether-fast-v1',
    'aether-reasoning-pro',
    'gpt-4o',
    'claude-3-5-sonnet',
  ],
  streaming: {
    enabled: true,
    typingDelayMs: 15,
    chunkTimeoutMs: 10000,
  },
  limits: {
    maxPromptLength: 16000,
    maxContextTokens: 128000,
    maxHistoryMessages: 100,
  },
  featureFlags: {
    enableReasoningMode: true,
    enableCodeExecution: true,
    enableMultimodalInputs: true,
  },
} as const;

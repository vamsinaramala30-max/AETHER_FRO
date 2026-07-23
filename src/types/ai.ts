import { BaseEntity, ID } from './common';

export type AIModelType = 'gpt-4o' | 'claude-3-5-sonnet' | 'llama-3' | 'custom-rag';

export interface AIAssistant extends BaseEntity {
  name: string;
  description: string;
  model: AIModelType;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  avatarUrl?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
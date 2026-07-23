import { env } from './environment';

export interface AppConfig {
  name: string;
  version: string;
  company: {
    name: string;
    website: string;
  };
  features: {
    analytics: boolean;
    mockAI: boolean;
    realtimeSync: boolean;
    auditLogs: boolean;
  };
  defaults: {
    language: string;
    dateFormat: string;
    pageSize: number;
  };
}

export const appConfig: AppConfig = {
  name: env.VITE_APP_NAME,
  version: env.VITE_APP_VERSION,
  company: {
    name: 'AETHER AI Systems',
    website: 'https://aether.ai',
  },
  features: {
    analytics: env.VITE_ENABLE_ANALYTICS,
    mockAI: env.VITE_ENABLE_MOCK_AI,
    realtimeSync: true,
    auditLogs: true,
  },
  defaults: {
    language: 'en-US',
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    pageSize: 20,
  },
} as const;
import { z } from 'zod';

/**
 * Zod schema for compile-time and runtime validation of environment variables.
 * Guarantees zero unhandled undefined values in application logic.
 */
const isProd = import.meta.env.PROD || import.meta.env.MODE === 'production';
const defaultApiBaseUrl = isProd
  ? (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('localhost')
      ? import.meta.env.VITE_API_BASE_URL
      : 'https://aether-bac.onrender.com/api/v1')
  : 'http://localhost:5001/api/v1';
const defaultWsUrl = isProd
  ? (import.meta.env.VITE_WS_URL && !import.meta.env.VITE_WS_URL.includes('localhost')
      ? import.meta.env.VITE_WS_URL
      : 'wss://aether-bac.onrender.com/ws')
  : 'ws://localhost:5001/ws';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_APP_NAME: z.string().default('AETHER Platform'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_API_BASE_URL: z
    .string()
    .refine((val) => val.startsWith('/') || /^https?:\/\//.test(val), {
      message: 'VITE_API_BASE_URL must be a valid relative path (e.g. /api/v1) or absolute URL',
    })
    .default(defaultApiBaseUrl)
    .transform((val) => {
      if (
        isProd &&
        (val.includes('localhost') ||
          val.includes('127.0.0.1') ||
          val.includes(':5001') ||
          val.includes(':5002'))
      ) {
        console.warn(
          '⚠️ [AETHER-PRODUCTION-SAFETY] Detected localhost/internal port in production frontend API URL. Overriding with production backend URL https://aether-bac.onrender.com/api/v1.',
        );
        return 'https://aether-bac.onrender.com/api/v1';
      }
      return val;
    }),
  VITE_API_TIMEOUT: z.coerce.number().default(30000),
  VITE_SUPABASE_URL: z
    .string()
    .refine((val) => val === '' || val.startsWith('/') || /^https?:\/\//.test(val), {
      message: 'VITE_SUPABASE_URL must be a valid relative path or absolute URL',
    })
    .optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  VITE_ENABLE_MOCK_AI: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  VITE_WS_URL: z
    .string()
    .refine((val) => val.startsWith('/') || /^wss?:\/\//.test(val) || /^https?:\/\//.test(val), {
      message: 'VITE_WS_URL must be a valid websocket or HTTP URL',
    })
    .default(defaultWsUrl)
    .transform((val) => {
      if (
        isProd &&
        (val.includes('localhost') ||
          val.includes('127.0.0.1') ||
          val.includes(':5001') ||
          val.includes(':5002'))
      ) {
        return 'wss://aether-bac.onrender.com/ws';
      }
      return val;
    }),
});

type Environment = z.infer<typeof envSchema>;

const validateEnv = (): Environment => {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables detected:', z.treeifyError(parsed.error));
    throw new Error('Invalid environment configuration.');
  }

  return parsed.data;
};

export const env = validateEnv();
export type { Environment };

import { z } from 'zod';

/**
 * Zod schema for compile-time and runtime validation of environment variables.
 * Guarantees zero unhandled undefined values in application logic.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_APP_NAME: z.string().default('AETHER Platform'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api'),
  VITE_API_TIMEOUT: z.coerce.number().default(30000),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  VITE_ENABLE_MOCK_AI: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  VITE_WS_URL: z.string().url().default('ws://localhost:5000/ws'),
});

type Environment = z.infer<typeof envSchema>;

const validateEnv = (): Environment => {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables detected:', parsed.error.format());
    throw new Error('Invalid environment configuration.');
  }

  return parsed.data;
};

export const env = validateEnv();
export type { Environment };
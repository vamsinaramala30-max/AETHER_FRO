import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/environment';
import { logger } from './logger';

let supabaseClient: SupabaseClient | null = null;

/**
 * Initializes and returns a singleton Supabase Client.
 * Gracefully defaults to null if Supabase key/URL are not supplied in env.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient !== null) return supabaseClient;

  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (
    typeof url !== 'string' ||
    url.trim() === '' ||
    typeof key !== 'string' ||
    key.trim() === ''
  ) {
    logger.warn('Supabase initialization skipped: Missing credentials in environment.');
    return null;
  }

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseClient;
};

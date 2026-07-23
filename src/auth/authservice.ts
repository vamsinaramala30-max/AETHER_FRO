// frontend/src/auth/authService.ts
import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. Auth service will operate in a disconnected state.'
  );
}

// Single initialized Supabase client instance using the public key boundary
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },

  async signInWithGoogle(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  subscribeToAuthChanges(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};
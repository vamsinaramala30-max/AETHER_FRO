import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAIStore } from '../ai/ai-store';
import { useNotificationStore } from './notificationStore';
import { useProjectStore } from './projectStore';
import { useAutomationStore } from './automationStore';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'member' | 'viewer';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, error: null, isLoading: false });
        try {
          localStorage.setItem('aether-auth-token', token);
          localStorage.setItem('auth_token', token);
          void useNotificationStore.getState().fetchNotifications();
        } catch {
          // Ignore storage error
        }
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      logout: () => {
        try {
          localStorage.removeItem('aether-auth-token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('aether_notifications');
          localStorage.removeItem('focus-timer-history');
          localStorage.removeItem('aether_focus_history_v2');

          useAIStore.getState().resetStore();
          useNotificationStore.getState().clearAll();
          useProjectStore.getState().setProjects([]);
          useAutomationStore.getState().setWorkflows([]);
        } catch {
          // Ignore cleanup errors
        }

        set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
      },
    }),
    {
      name: 'aether-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);


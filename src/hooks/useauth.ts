import { useCallback } from 'react';
import { useAuthStore, User } from '../state/authStore';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const setAuth = useAuthStore((s) => s.setAuth);
  const setError = useAuthStore((s) => s.setError);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logoutStore = useAuthStore((s) => s.logout);

  const login = useCallback(
    async (credentials: { email: string; pass: string }) => {
      setLoading(true);
      try {
        const mockUser: User = { id: 'usr_1', email: credentials.email, name: 'Aether User', role: 'admin' };
        setAuth(mockUser, 'jwt_token_sample');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    },
    [setAuth, setError, setLoading]
  );

  const logout = useCallback(() => {
    logoutStore();
  }, [logoutStore]);

  return { user, token, isAuthenticated, isLoading, error, login, logout };
};
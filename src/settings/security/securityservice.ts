import { api } from '../../shared/api';

export interface UserSession {
  id: string;
  browser: string;
  os: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export const securityService = {
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/settings/password', { currentPassword, newPassword });
  },

  getActiveSessions: async (): Promise<UserSession[]> => {
    const response = await api.get<any>('/settings/sessions');
    return response.data?.data || response.data || [];
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/settings/sessions/${sessionId}`);
  },

  revokeAllOtherSessions: async (): Promise<string> => {
    const response = await api.post<any>('/settings/sessions/revoke-all');
    return response.data?.message || 'Other active sessions revoked.';
  },

  deleteAccount: async (confirmationText: string, password?: string): Promise<void> => {
    await api.delete('/settings/account', {
      data: { confirmationText, password },
    });
  },
};

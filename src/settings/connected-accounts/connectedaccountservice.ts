import { api } from '../../shared/api';

export interface ConnectedAccount {
  provider: string;
  name: string;
  connected: boolean;
  accountEmail?: string | null;
  connectedAt?: string | null;
  canDisconnect?: boolean;
}

export const connectedAccountsService = {
  getConnectedAccounts: async (): Promise<ConnectedAccount[]> => {
    try {
      const response = await api.get<any>('/settings/connections');
      if (response.data?.data) return response.data.data;
      if (response.data) return response.data;
    } catch {
      // Fallback endpoint
      const res = await api.get<any>('/users/connected-accounts');
      if (res.data?.data) return res.data.data;
      if (res.data) return res.data;
    }
    return [];
  },

  disconnectAccount: async (provider: string): Promise<void> => {
    await api.delete(`/settings/connections/${provider}`);
  },

  connectGoogle: (): void => {
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:5001/api/v1';
    const googleAuthUrl = `${backendUrl}/auth/google`;
    window.location.href = googleAuthUrl;
  },
};

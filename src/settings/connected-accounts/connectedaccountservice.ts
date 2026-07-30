// frontend/src/settings/connected-accounts/connectedAccountsService.ts
import { api } from '../../shared/api';

export interface ConnectedAccount {
  provider: 'github' | 'google' | 'gitlab';
  identityName: string;
  connectedAt?: string;
}

export const connectedAccountsService = {
  getConnectedAccounts: async (): Promise<ConnectedAccount[]> => {
    const response = await api.get<ConnectedAccount[]>('/users/connected-accounts');
    return response.data;
  },

  disconnectAccount: async (provider: string): Promise<void> => {
    await api.delete(`/users/connected-accounts/${provider}`);
  },
};

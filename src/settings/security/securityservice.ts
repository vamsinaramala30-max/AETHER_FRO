// frontend/src/settings/security/securityService.ts
import { api } from '../../shared/api';

export interface UpdatePasswordPayload {
  currentPasswordHash: string;
  newPasswordHash: string;
}

export const securityService = {
  changePassword: async (payload: UpdatePasswordPayload): Promise<void> => {
    // Encrypted/hashed delivery parameters processed natively via network stack architecture
    await api.post('/auth/security/credentials', payload);
  },
  
  toggleTwoFactor: async (enabled: boolean): Promise<{ secret?: string; enabled: boolean }> => {
    const response = await api.post('/auth/security/2fa', { enabled });
    return response.data;
  }
};
import { apiClient, RequestConfig } from './client';
import { ENDPOINTS } from './endpoints';

export interface AdminUserListItem {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string | null;
  role: string;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface AdminUsersResponse {
  users: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminOverviewMetrics {
  users: {
    total: number;
    active: number;
    unverified: number;
    suspended: number;
    twoFactorEnabled: number;
    admins: number;
  };
  system: {
    nodeVersion: string;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    uptimeSeconds: number;
    environment: string;
  };
  services: {
    database: {
      status: 'up' | 'degraded' | 'down';
      latencyMs?: number;
      version?: string;
      provider: 'self-hosted-postgresql' | 'managed-postgresql';
    };
    redis: {
      status: 'up' | 'down' | 'unconfigured';
    };
    aiModel: {
      status: 'up' | 'down' | 'unconfigured';
      endpoint?: string;
    };
    storage: {
      driver: 'local' | 'supabase';
      status: 'ready' | 'misconfigured';
    };
  };
  backups: {
    lastBackupTimestamp: string | null;
    lastRestoreVerificationTimestamp: string | null;
    status: 'healthy' | 'warning' | 'unverified' | 'failed';
    backupSizeBytes?: number;
    evidenceFound: boolean;
    storagePath?: string;
    details: string;
  };
  recentSecurityEvents: Array<{
    id: string;
    action: string;
    actorEmail?: string | null;
    ipAddress?: string | null;
    resource: string;
    createdAt: string;
    payload?: any;
  }>;
}

export interface AdminAuditLogsResponse {
  logs: Array<{
    id: string;
    action: string;
    resource: string;
    payload?: any;
    ipAddress?: string | null;
    createdAt: string;
    user?: {
      id: string;
      email: string;
      fullName?: string | null;
      role: string;
    } | null;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminDatabaseStatus {
  connected: boolean;
  latencyMs: number;
  version: string;
  databaseSize: string;
  sqlBrowserAccessAllowed: boolean;
  backup: AdminOverviewMetrics['backups'];
}

export interface AdminLoginResult {
  mfaRequired?: boolean;
  mfaTicket?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export const adminApi = {
  login: async (
    payload: { email: string; password: string; mfaCode?: string },
    config?: RequestConfig,
  ): Promise<AdminLoginResult> => {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.LOGIN, payload, {
      ...config,
      skipAuth: true,
    });
    return (res as any)?.data ?? res;
  },

  verifyMfa: async (
    payload: { mfaTicket: string; code: string },
    config?: RequestConfig,
  ): Promise<AdminLoginResult> => {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.MFA_VERIFY, payload, {
      ...config,
      skipAuth: true,
    });
    return (res as any)?.data ?? res;
  },

  logout: async (config?: RequestConfig): Promise<void> => {
    await apiClient.post(ENDPOINTS.ADMIN.LOGOUT, {}, config);
  },

  getOverview: async (config?: RequestConfig): Promise<AdminOverviewMetrics> => {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.OVERVIEW, config);
    return (res as any)?.data ?? res;
  },

  getUsers: async (
    params?: { page?: number; limit?: number; search?: string; role?: string; status?: string },
    config?: RequestConfig,
  ): Promise<AdminUsersResponse> => {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.USERS, {
      ...config,
      params,
    });
    return (res as any)?.data ?? res;
  },

  updateUserRole: async (
    id: string,
    role: string,
    config?: RequestConfig,
  ): Promise<{ id: string; email: string; role: string }> => {
    const res = await apiClient.patch<any>(ENDPOINTS.ADMIN.USER_ROLE(id), { role }, config);
    return (res as any)?.data ?? res;
  },

  updateUserStatus: async (
    id: string,
    status: 'ACTIVE' | 'SUSPENDED',
    config?: RequestConfig,
  ): Promise<{ id: string; email: string; status: string; deletedAt: string | null }> => {
    const res = await apiClient.patch<any>(ENDPOINTS.ADMIN.USER_STATUS(id), { status }, config);
    return (res as any)?.data ?? res;
  },

  revokeSessions: async (
    id: string,
    config?: RequestConfig,
  ): Promise<{ success: boolean; revokedCount: number }> => {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.REVOKE_SESSIONS(id), {}, config);
    return (res as any)?.data ?? res;
  },

  exportUserData: async (id: string, config?: RequestConfig): Promise<any> => {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.EXPORT_USER(id), {}, config);
    return (res as any)?.data ?? res;
  },

  getAuditLogs: async (
    params?: { page?: number; limit?: number; action?: string; userId?: string },
    config?: RequestConfig,
  ): Promise<AdminAuditLogsResponse> => {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.AUDIT_LOGS, {
      ...config,
      params,
    });
    return (res as any)?.data ?? res;
  },

  getDatabaseStatus: async (config?: RequestConfig): Promise<AdminDatabaseStatus> => {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.DATABASE_STATUS, config);
    return (res as any)?.data ?? res;
  },

  triggerBackup: async (
    config?: RequestConfig,
  ): Promise<{ success: boolean; message: string; timestamp: string }> => {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.TRIGGER_BACKUP, {}, config);
    return (res as any)?.data ?? res;
  },

  getSystemMetrics: async (config?: RequestConfig): Promise<any> => {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.SYSTEM_METRICS, config);
    return (res as any)?.data ?? res;
  },
};

export interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  tokenHeader: string;
  tokenPrefix: string;
  sessionTimeoutMs: number;
  autoRefreshIntervalMs: number;
  providers: Array<'google' | 'github' | 'saml' | 'email'>;
}

export const authConfig: AuthConfig = {
  tokenKey: 'aether_access_token',
  refreshTokenKey: 'aether_refresh_token',
  tokenHeader: 'Authorization',
  tokenPrefix: 'Bearer ',
  sessionTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  autoRefreshIntervalMs: 5 * 60 * 1000, // 5 minutes
  providers: ['email', 'google', 'github', 'saml'],
} as const;

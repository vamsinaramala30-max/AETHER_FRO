export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  locale: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
}

export interface UserSettings {
  profile: ProfileSettings;
  security: SecuritySettings;
  theme: 'light' | 'dark' | 'system';
}

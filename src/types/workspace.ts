import { BaseEntity, ID } from './common';
import { UserRole } from './auth';

export interface WorkspaceMember extends BaseEntity {
  workspaceId: ID;
  userId: ID;
  role: UserRole;
  email: string;
  name: string;
}

export interface Workspace extends BaseEntity {
  name: string;
  slug: string;
  logoUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
}
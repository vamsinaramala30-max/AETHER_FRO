import { BaseEntity, ID } from './common';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem extends BaseEntity {
  userId: ID;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
}

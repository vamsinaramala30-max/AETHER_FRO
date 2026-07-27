export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

type NotificationListener = (notifications: AppNotification[]) => void;

export class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.notifications);
    return () => this.listeners.delete(listener);
  }

  public notify(type: AppNotification['type'], message: string): void {
    const item: AppNotification = { id: crypto.randomUUID(), type, message };
    this.notifications = [...this.notifications, item];
    this.listeners.forEach((fn) => {
      fn(this.notifications);
    });
  }

  public dismiss(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.listeners.forEach((fn) => {
      fn(this.notifications);
    });
  }
}

export const notificationService = new NotificationService();

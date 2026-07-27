interface StorageItem<T> {
  value: T;
  expiresAt?: number;
}

export class SafeStorage {
  private storage: Storage | null;

  constructor(type: 'local' | 'session') {
    try {
      this.storage = type === 'local' ? window.localStorage : window.sessionStorage;
    } catch {
      this.storage = null; // Graceful fallback for non-browser/restricted environments
    }
  }

  set(key: string, value: unknown, ttlMs?: number): boolean {
    if (this.storage === null) return false;
    try {
      const item: StorageItem<unknown> = {
        value,
        expiresAt: typeof ttlMs === 'number' && ttlMs > 0 ? Date.now() + ttlMs : undefined,
      };
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string, fallback?: T): T | null {
    if (this.storage === null) return fallback ?? null;
    try {
      const raw = this.storage.getItem(key);
      if (typeof raw !== 'string' || raw.trim() === '') return fallback ?? null;

      const item = JSON.parse(raw) as StorageItem<T>;

      if (typeof item.expiresAt === 'number' && Date.now() > item.expiresAt) {
        this.remove(key);
        return fallback ?? null;
      }

      return item.value;
    } catch {
      return fallback ?? null;
    }
  }

  remove(key: string): boolean {
    if (this.storage === null) return false;
    try {
      this.storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    if (this.storage !== null) {
      try {
        this.storage.clear();
      } catch {
        // Suppress storage clearing exceptions
      }
    }
  }
}

export const localStorageUtil = new SafeStorage('local');
export const sessionStorageUtil = new SafeStorage('session');

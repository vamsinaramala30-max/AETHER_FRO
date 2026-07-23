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

  set<T>(key: string, value: T, ttlMs?: number): boolean {
    if (!this.storage) return false;
    try {
      const item: StorageItem<T> = {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      };
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string): T | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(key);
      if (!raw) return null;

      const item: StorageItem<T> = JSON.parse(raw);

      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  remove(key: string): boolean {
    if (!this.storage) return false;
    try {
      this.storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    if (this.storage) {
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
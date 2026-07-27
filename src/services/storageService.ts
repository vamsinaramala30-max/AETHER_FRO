const PREFIX = 'aether_';

export const storageService = {
  set(key: string, value: unknown): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${PREFIX}${key}`, serialized);
    } catch (e) {
      console.error('StorageService set error', e);
    }
  },

  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      if (typeof item === 'string' && item.trim() !== '') {
        return JSON.parse(item) as T;
      }
      return defaultValue;
    } catch (e) {
      console.error('StorageService get error', e);
      return defaultValue;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => {
        localStorage.removeItem(k);
      });
  },
};

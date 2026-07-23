export class StorageService {
  private prefix = 'aether_';

  public set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (e) {
      console.error('StorageService set error', e);
    }
  }

  public get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (e) {
      console.error('StorageService get error', e);
      return defaultValue;
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  public clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(this.prefix))
      .forEach((k) => { localStorage.removeItem(k); });
  }
}

export const storageService = new StorageService();
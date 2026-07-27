export const offlineService = {
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  registerOnlineListener(callback: () => void): () => void {
    window.addEventListener('online', callback);
    return () => {
      window.removeEventListener('online', callback);
    };
  },

  registerOfflineListener(callback: () => void): () => void {
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('offline', callback);
    };
  },
};

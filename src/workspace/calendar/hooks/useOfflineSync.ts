import { useEffect, useState } from 'react';
import { OfflineService } from '../services/offlineService';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(OfflineService.isOnline());

  useEffect(() => {
    const cleanupOnline = OfflineService.registerOnlineListener(() => setIsOnline(true));
    const cleanupOffline = OfflineService.registerOfflineListener(() => setIsOnline(false));

    return () => {
      cleanupOnline();
      cleanupOffline();
    };
  }, []);

  return { isOnline };
};
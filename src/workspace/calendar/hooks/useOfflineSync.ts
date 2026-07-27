import { useEffect, useState } from 'react';
import { offlineService } from '../services/offlineService';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineService.isOnline());

  useEffect(() => {
    const cleanupOnline = offlineService.registerOnlineListener(() => {
      setIsOnline(true);
    });
    const cleanupOffline = offlineService.registerOfflineListener(() => {
      setIsOnline(false);
    });

    return () => {
      cleanupOnline();
      cleanupOffline();
    };
  }, []);

  return { isOnline };
};

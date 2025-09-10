import { useState, useCallback } from 'react';

interface UseUnderMaintenanceOptions {
  sectionName: string;
  maxRetries?: number;
  retryDelay?: number;
}

export function useUnderMaintenance({ 
  sectionName, 
  maxRetries = 3, 
  retryDelay = 1000 
}: UseUnderMaintenanceOptions) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const showMaintenance = useCallback(() => {
    setIsUnderMaintenance(true);
  }, []);

  const hideMaintenance = useCallback(() => {
    setIsUnderMaintenance(false);
    setRetryCount(0);
  }, []);

  const retry = useCallback(async (retryFunction: () => Promise<void>) => {
    if (retryCount >= maxRetries) {
      console.warn(`Максимальное количество попыток (${maxRetries}) достигнуто для ${sectionName}`);
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      const result = await retryFunction();
      
      if (result) {
        hideMaintenance();
        return result;
      }
    } catch (error) {
      console.error(`Ошибка при повторной попытке для ${sectionName}:`, error);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, retryDelay, sectionName, hideMaintenance]);

  const canRetry = retryCount < maxRetries;

  return {
    isUnderMaintenance,
    retryCount,
    isRetrying,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  };
}

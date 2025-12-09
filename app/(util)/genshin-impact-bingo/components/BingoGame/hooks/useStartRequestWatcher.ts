import { useEffect } from 'react';
import {
  checkStartRequestTimeout,
  validateStartRequest,
} from '../../../lib/game';

export function useStartRequestWatcher() {
  useEffect(() => {
    const startRequestCheckInterval = setInterval(() => {
      void checkStartRequestTimeout();
      void validateStartRequest();
    }, 5000);

    return () => {
      clearInterval(startRequestCheckInterval);
    };
  }, []);
}

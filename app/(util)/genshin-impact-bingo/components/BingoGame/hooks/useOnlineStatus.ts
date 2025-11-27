import { useEffect } from 'react';
import {
  checkAndUpdateOfflineUsers,
  checkStartRequestTimeout,
  heartbeat,
  updateOnlineStatus,
  validateStartRequest,
} from '../../../lib/game';

export function useOnlineStatus(userId: number | undefined) {
  // 주기적 하트비트 및 오프라인 유저 체크
  useEffect(() => {
    if (!userId) return;

    const heartbeatInterval = setInterval(() => {
      void heartbeat(userId);
    }, 10_000);

    const offlineCheckInterval = setInterval(() => {
      void checkAndUpdateOfflineUsers();
    }, 15_000);

    const startRequestCheckInterval = setInterval(() => {
      void checkStartRequestTimeout();
      void validateStartRequest();
    }, 5000);

    void heartbeat(userId);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(offlineCheckInterval);
      clearInterval(startRequestCheckInterval);
    };
  }, [userId]);

  // 창 포커스/이탈 감지
  useEffect(() => {
    if (!userId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void updateOnlineStatus(userId, false);
      } else if (document.visibilityState === 'visible') {
        void updateOnlineStatus(userId, true);
      }
    };

    const handleBeforeUnload = () => {
      void updateOnlineStatus(userId, false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId]);
}

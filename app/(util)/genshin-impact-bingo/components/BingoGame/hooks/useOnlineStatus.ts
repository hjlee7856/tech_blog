import { useEffect } from 'react';
import { updateOnlineStatus } from '../../../lib/game';

export function useOnlineStatus(userId: number | undefined) {
  useEffect(() => {
    if (!userId) return;

    let isCancelled = false;

    // 마운트 시점에 한 번 온라인 표시
    void updateOnlineStatus(userId, true);

    // 주기적으로 last_seen 갱신 (heartbeat)
    const heartbeatId = setInterval(() => {
      if (isCancelled) return;
      void updateOnlineStatus(userId, true);
    }, 15_000);

    return () => {
      isCancelled = true;
      clearInterval(heartbeatId);
      void updateOnlineStatus(userId, false);
    };
  }, [userId]);
}

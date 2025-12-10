import { useEffect } from 'react';
import { usePresenceOnlineUsers } from './usePresenceOnlineUsers';

const REPORT_INTERVAL_MS = 10_000;

export function usePresenceReporter(userId?: number) {
  const { onlineUserIds } = usePresenceOnlineUsers(userId);

  useEffect(() => {
    // onlineUserIds가 비어 있을 때는 스냅샷을 보내지 않음
    if (onlineUserIds.length === 0) {
      console.log('[presence-reporter] skip report (empty onlineUserIds)', {
        userId,
      });
      return;
    }

    const report = async () => {
      try {
        const body = {
          onlineUserIds,
          clientTimestamp: new Date().toISOString(),
        };

        console.log('[presence-reporter] POST /online-users', body);

        await fetch('/api/genshin-impact-bingo/online-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      } catch {
        // ignore
      }
    };

    // 즉시 한 번 보고
    void report();

    // 이후 주기적으로 보고
    const intervalId = setInterval(() => {
      void report();
    }, REPORT_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [onlineUserIds, userId]);
}

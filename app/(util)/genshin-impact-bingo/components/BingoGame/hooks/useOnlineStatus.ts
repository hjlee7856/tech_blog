import { useEffect, useRef } from 'react';
import { updateOnlineStatus } from '../../../lib/game';
import { getPresenceChannel } from './presenceChannel';

type PresenceChannel = ReturnType<typeof getPresenceChannel>;

export function useOnlineStatus(userId: number | undefined) {
  const channelRef = useRef<PresenceChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = getPresenceChannel(userId);
    channelRef.current = channel;

    let heartbeatId: ReturnType<typeof setInterval> | null = null;

    channel.subscribe((status) => {
      console.log('[presence] useOnlineStatus subscribe status', {
        status,
        userId,
      });
      if (status !== 'SUBSCRIBED') return;
      console.log('[presence] useOnlineStatus track start', { userId });
      void channel.track({ user_id: userId });
      void updateOnlineStatus(userId, true);

      // 주기적으로 last_seen 갱신 (heartbeat)
      if (!heartbeatId) {
        heartbeatId = setInterval(() => {
          console.log(
            '[presence] useOnlineStatus heartbeat updateOnlineStatus',
            {
              userId,
            },
          );
          void updateOnlineStatus(userId, true);
        }, 15_000);
      }
    });

    return () => {
      if (!channelRef.current) return;
      void channelRef.current.untrack();
      void channelRef.current.unsubscribe();
      void updateOnlineStatus(userId, false);
      if (heartbeatId) clearInterval(heartbeatId);
      channelRef.current = null;
    };
  }, [userId]);
}

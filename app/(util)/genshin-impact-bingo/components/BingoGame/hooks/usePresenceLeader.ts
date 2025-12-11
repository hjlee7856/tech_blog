'use client';

import { useEffect, useState } from 'react';

import { getPresenceChannel } from './presenceClient';

export interface UsePresenceLeaderArgs {
  userId?: number;
}

export interface UsePresenceLeaderReturn {
  isLeader: boolean;
}

interface PresenceMeta {
  user_id: number;
  randomToken?: string;
  sent_at?: string;
  source?: string;
  presence_ref?: string;
}

interface PresenceState {
  [key: string]: PresenceMeta[];
}

export function usePresenceLeader(
  args: UsePresenceLeaderArgs = {},
): UsePresenceLeaderReturn {
  const { userId } = args;
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    console.log('[leader] effect run', { userId });

    if (!userId) {
      console.log('[leader] no userId, reset isLeader');
      setIsLeader(false);
      return;
    }

    const channel = getPresenceChannel();
    console.log('[leader] got presence channel');

    const updateLeaderFromState = () => {
      const rawState = channel.presenceState() as unknown;
      console.log(
        '[leader] updateLeaderFromState called, rawState =',
        rawState,
      );

      const parsedState: PresenceState =
        typeof rawState === 'string'
          ? (JSON.parse(rawState) as PresenceState)
          : ((rawState || {}) as PresenceState);

      const metas = parsedState['genshin-bingo-presence'] ?? [];
      if (!Array.isArray(metas) || metas.length === 0) {
        console.log('[leader] no metas');
        setIsLeader(false);
        return;
      }

      console.log('[leader] rawState', rawState);
      console.log('[leader] metas', metas);
      console.log('[leader] userId', userId);

      const userIds = metas
        .map((meta) => meta.user_id)
        .filter((id): id is number => typeof id === 'number');
      console.log('[leader] userIds =', userIds);

      if (userIds.length === 0) {
        console.log('[leader] no numeric userIds');
        setIsLeader(false);
        return;
      }

      const minUserId = Math.min(...userIds);
      console.log('[leader] minUserId =', minUserId);

      const nextIsLeader = userId === minUserId;
      console.log('[leader] nextIsLeader =', nextIsLeader);
      console.log('[leader] nextIsLeader', nextIsLeader);
      setIsLeader(nextIsLeader);

      // 리더 탭일 때 presence 상태가 바뀌면 즉시 한 번 /check-turn 호출
      if (nextIsLeader) {
        void fetch('/api/genshin-impact-bingo/check-turn', {
          method: 'POST',
        }).catch(() => undefined);
      }
    };

    const subscription = channel
      .on('presence', { event: 'sync' }, () => {
        console.log('[leader] presence sync event');
        updateLeaderFromState();
      })
      .subscribe((status) => {
        console.log('[leader] subscribe status', status);
        if (status !== 'SUBSCRIBED') return;

        console.log('[leader] tracking presence for user', userId);
        void channel.track({
          user_id: userId,
          sent_at: new Date().toISOString(),
          source:
            typeof window !== 'undefined'
              ? window.name || 'bingo-tab'
              : 'server',
        });

        updateLeaderFromState();
      });

    return () => {
      console.log('[leader] cleanup, unsubscribe');
      void subscription.unsubscribe();
      setIsLeader(false);
    };
  }, [userId]);

  return { isLeader };
}

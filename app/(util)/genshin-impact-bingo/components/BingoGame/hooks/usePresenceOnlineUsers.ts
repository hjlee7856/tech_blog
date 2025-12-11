import { useEffect, useState } from 'react';
import { getPresenceChannel } from './presenceChannel';

interface PresenceMeta {
  user_id?: number;
}

// Supabase Realtime presenceState는 보통
// { [key: string]: { metas: PresenceMeta[] } } 형태를 가정한다.
interface PresenceStateEntry {
  metas?: PresenceMeta[];
}

interface PresenceState {
  [key: string]: PresenceStateEntry;
}

export function usePresenceOnlineUsers(userId?: number) {
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  useEffect(() => {
    console.log('[presence] usePresenceOnlineUsers effect start', { userId });

    if (typeof userId !== 'number') return;

    const channel = getPresenceChannel(userId);

    const updateFromState = () => {
      const state = channel.presenceState() as PresenceState;

      console.log('[presence] usePresenceOnlineUsers presenceState raw', {
        userId,
        state,
      });

      const allPresences = Object.values(state).flatMap((entry) => {
        if (!entry || !Array.isArray(entry.metas)) return [] as PresenceMeta[];
        return entry.metas;
      });

      console.log('[presence] usePresenceOnlineUsers allPresences', {
        userId,
        allPresences,
      });

      const count = allPresences.length;
      const ids = allPresences
        .map((meta) => meta.user_id)
        .filter((id): id is number => typeof id === 'number');

      const uniqueIds = Array.from(new Set(ids));

      console.log('[presence] usePresenceOnlineUsers derived', {
        userId,
        count,
        uniqueIds,
      });

      setOnlineUserCount(count);
      setOnlineUserIds(uniqueIds);
    };

    // effect 진입 시점의 state를 한 번 반영
    updateFromState();

    // 이후 sync 이벤트마다 다시 반영
    channel.on('presence', { event: 'sync' }, updateFromState);

    // 채널 생성/구독/track은 useOnlineStatus에서 담당
    return () => {
      setOnlineUserCount(0);
      setOnlineUserIds([]);
    };
  }, [userId]);

  return { onlineUserCount, onlineUserIds };
}

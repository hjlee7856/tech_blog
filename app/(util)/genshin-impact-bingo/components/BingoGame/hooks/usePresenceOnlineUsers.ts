import { useEffect, useState } from 'react';
import { getPresenceChannel } from './presenceChannel';

interface PresenceMeta {
  user_id?: number;
}

interface PresenceState {
  [key: string]: PresenceMeta[];
}

export function usePresenceOnlineUsers(userId?: number) {
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof userId !== 'number') return;

    const channel = getPresenceChannel(userId);

    const updateFromState = () => {
      const state = channel.presenceState() as PresenceState;

      const allPresences = Object.values(state).flat();

      const count = allPresences.length;
      const ids = allPresences
        .map((meta) => meta.user_id)
        .filter((id): id is number => typeof id === 'number');

      const uniqueIds = Array.from(new Set(ids));

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

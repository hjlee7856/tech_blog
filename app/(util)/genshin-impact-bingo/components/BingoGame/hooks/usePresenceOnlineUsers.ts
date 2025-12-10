import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

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
    const channel = supabase.channel('genshin-bingo-presence', {
      config: {
        presence: {
          // presence 채널은 플레이어(useOnlineStatus)와 동일 채널을 공유하고,
          // 여기서는 뷰어/관전자도 같은 채널에서 온라인 유저 목록만 읽어온다.
          key: `viewer-${Math.random().toString(36).slice(2)}`,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as PresenceState;

      const allPresences = Object.values(state).flat();

      const count = allPresences.length;
      const ids = allPresences
        .map((meta) => meta.user_id)
        .filter((id): id is number => typeof id === 'number');

      const uniqueIds = Array.from(new Set(ids));

      // presence 기반 온라인 유저 id 디버깅용 로그
      // (필요 없어진 뒤에는 제거해도 됨)

      console.log('[presence] sync', {
        userId,
        rawState: state,
        allPresencesCount: allPresences.length,
        uniqueIds,
      });

      setOnlineUserCount(count);
      setOnlineUserIds(uniqueIds);
    });

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return;

      if (typeof userId === 'number') {
        void channel.track({ role: 'viewer', user_id: userId });
      } else {
        void channel.track({ role: 'viewer' });
      }
    });

    return () => {
      void channel.untrack();
      void channel.unsubscribe();
    };
  }, [userId]);

  return { onlineUserCount, onlineUserIds };
}

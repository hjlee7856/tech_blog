import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

interface PresenceMeta {
  user_id?: number;
}

interface PresenceState {
  [key: string]: PresenceMeta[];
}

export function usePresenceOnlineUsers() {
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  useEffect(() => {
    const channel = supabase.channel('genshin-bingo-presence-view', {
      config: {
        presence: {
          // viewer용 임의 키 (다른 클라이언트와 겹쳐도 문제 없음)
          key: `viewer-${Math.random().toString(36).slice(2)}`,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as PresenceState;
      const ids = Object.values(state)
        .flat()
        .map((meta) => meta.user_id)
        .filter((id): id is number => typeof id === 'number');

      // 중복 제거
      setOnlineUserIds(Array.from(new Set(ids)));
    });

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return;
      void channel.track({ role: 'viewer' });
    });

    return () => {
      void channel.untrack();
      void channel.unsubscribe();
    };
  }, []);

  return { onlineUserIds };
}

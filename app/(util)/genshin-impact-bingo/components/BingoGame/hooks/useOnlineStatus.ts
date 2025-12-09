import { supabase } from '@/lib/supabaseClient';
import { useEffect, useRef } from 'react';
import { updateOnlineStatus } from '../../../lib/game';

export function useOnlineStatus(userId: number | undefined) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('genshin-bingo-presence', {
      config: {
        presence: {
          key: String(userId),
        },
      },
    });

    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      // 필요하면 여기서 presenceState를 읽어 클라이언트 측 online 리스트를 계산할 수 있음
      // const state = channel.presenceState();
    });

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return;
      void channel.track({ user_id: userId });
      void updateOnlineStatus(userId, true);
    });

    return () => {
      if (!channelRef.current) return;
      void channelRef.current.untrack();
      void channelRef.current.unsubscribe();
      void updateOnlineStatus(userId, false);
      channelRef.current = null;
    };
  }, [userId]);
}

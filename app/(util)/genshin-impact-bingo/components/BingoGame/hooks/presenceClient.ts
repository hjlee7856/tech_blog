import { supabase } from '@/lib/supabaseClient';

let presenceChannel: ReturnType<typeof supabase.channel> | null = null;

export function getPresenceChannel() {
  if (!presenceChannel) {
    presenceChannel = supabase.channel('presence', {
      config: {
        presence: {
          // key는 presences를 구분하는 식별자. 여기서는 단순 예제로 'user_id' 사용
          key: 'genshin-bingo-presence',
        },
      },
    });
  }

  return presenceChannel;
}

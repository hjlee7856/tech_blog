import { supabase } from '@/lib/supabaseClient';

let presenceChannel: ReturnType<typeof supabase.channel> | null = null;

export function getPresenceChannel(userId: number) {
  if (!presenceChannel) {
    presenceChannel = supabase.channel('genshin-bingo-presence', {
      config: {
        presence: {
          // key는 유저 ID 문자열로, 한 탭당 하나의 유저만 사용한다는 전제
          key: String(userId),
        },
      },
    });
  }

  return presenceChannel;
}

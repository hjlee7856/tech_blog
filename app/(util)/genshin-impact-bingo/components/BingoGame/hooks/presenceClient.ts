import { supabase } from '@/lib/supabaseClient';

let presenceChannel: ReturnType<typeof supabase.channel> | null = null;
let presenceKey: string | null = null;

interface GetPresenceChannelParams {
  userId: number;
}

export function getPresenceChannel({ userId }: GetPresenceChannelParams) {
  const nextPresenceKey = String(userId);
  if (presenceChannel && presenceKey && presenceKey !== nextPresenceKey) {
    void supabase.removeChannel(presenceChannel);
    presenceChannel = null;
    presenceKey = null;
  }

  if (!presenceChannel) {
    presenceKey = nextPresenceKey;
    presenceChannel = supabase.channel('presence', {
      config: {
        presence: {
          key: nextPresenceKey,
        },
      },
    });
  }

  return presenceChannel;
}

interface ReleasePresenceChannelParams {
  userId: number;
}

export function releasePresenceChannel({
  userId,
}: ReleasePresenceChannelParams) {
  const nextPresenceKey = String(userId);
  if (!presenceChannel || !presenceKey) return;
  if (presenceKey !== nextPresenceKey) return;

  void supabase.removeChannel(presenceChannel);
  presenceChannel = null;
  presenceKey = null;
}

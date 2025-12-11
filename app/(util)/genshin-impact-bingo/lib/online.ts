import { supabase } from '@/lib/supabaseClient';

const ONLINE_GRACE_MS = 45_000;

export async function getOnlineUserIds(): Promise<number[]> {
  try {
    const { data, error } = await supabase
      .from('genshin-bingo-game-user')
      .select('id, last_seen');

    if (error || !data) return [];

    const now = Date.now();

    return (data as { id: number; last_seen: string | null }[])
      .filter((row) => {
        if (!row.last_seen) return false;
        const t = new Date(row.last_seen).getTime();
        if (Number.isNaN(t)) return false;
        return now - t <= ONLINE_GRACE_MS;
      })
      .map((row) => row.id);
  } catch {
    return [];
  }
}

import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

// last_seen 기반 온라인 유저 판정 유예 시간 (ms)
// 브라우저 sleep / heartbeat 지연을 고려해 약간 넉넉하게 유지
const ONLINE_GRACE_MS = 30_000;

export async function GET() {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select('id, last_seen');

  if (error || !data) return NextResponse.json({ onlineUserIds: [] });

  const now = Date.now();

  const onlineUserIds = (data as { id: number; last_seen: string | null }[])
    .filter((row) => {
      if (!row.last_seen) return false;
      const t = new Date(row.last_seen).getTime();
      if (Number.isNaN(t)) return false;
      return now - t <= ONLINE_GRACE_MS;
    })
    .map((row) => row.id);

  return NextResponse.json({ onlineUserIds });
}

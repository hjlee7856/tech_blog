import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('genshin-bingo-game-user')
    .select(
      'id, name, score, order, is_admin, is_ready, last_seen, bingo_message, bingo_message_at, profile_image',
    )
    .order('order', { ascending: true });

  if (error || !data) return NextResponse.json({ players: [] });

  return NextResponse.json({ players: data });
}

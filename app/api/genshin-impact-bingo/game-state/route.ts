import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('genshin-bingo-game-state')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return NextResponse.json({ gameState: null });

  return NextResponse.json({ gameState: data });
}

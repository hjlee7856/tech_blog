import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

interface OnlineUsersSnapshotRow {
  id: number;
  online_user_ids: number[] | null;
  snapshot_at: string | null;
}

const SNAPSHOT_ROW_ID = 1;

export async function GET() {
  const { data, error } = await supabase
    .from('genshin-bingo-online-snapshot')
    .select('*')
    .eq('id', SNAPSHOT_ROW_ID)
    .single();

  if (error || !data) return NextResponse.json({ onlineUserIds: [] });

  const row = data as OnlineUsersSnapshotRow;
  const onlineUserIds = Array.isArray(row.online_user_ids)
    ? row.online_user_ids.filter((id): id is number => typeof id === 'number')
    : [];

  return NextResponse.json({ onlineUserIds });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    onlineUserIds?: unknown;
    clientTimestamp?: unknown;
  };

  const onlineUserIds = Array.isArray(body.onlineUserIds)
    ? body.onlineUserIds.filter((id): id is number => typeof id === 'number')
    : [];

  const clientTimestamp =
    typeof body.clientTimestamp === 'string' ? body.clientTimestamp : null;

  if (!clientTimestamp)
    return NextResponse.json(
      { success: false, reason: 'invalid_timestamp' },
      { status: 400 },
    );

  // 기존 스냅샷 읽기
  const { data: existing } = await supabase
    .from('genshin-bingo-online-snapshot')
    .select('*')
    .eq('id', SNAPSHOT_ROW_ID)
    .maybeSingle();

  const existingRow = existing as OnlineUsersSnapshotRow | null;

  // 기존 스냅샷이 있고, 그 snapshot_at이 더 최신이면 무시
  if (existingRow?.snapshot_at) {
    const prev = new Date(existingRow.snapshot_at).getTime();
    const curr = new Date(clientTimestamp).getTime();

    if (!Number.isNaN(prev) && !Number.isNaN(curr) && prev >= curr)
      return NextResponse.json({ success: false, reason: 'stale' });
  }

  const { error } = await supabase.from('genshin-bingo-online-snapshot').upsert(
    {
      id: SNAPSHOT_ROW_ID,
      online_user_ids: onlineUserIds,
      snapshot_at: clientTimestamp,
    },
    { onConflict: 'id' },
  );

  if (error)
    return NextResponse.json(
      { success: false, reason: 'db_error' },
      { status: 500 },
    );

  return NextResponse.json({ success: true });
}

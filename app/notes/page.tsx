'use client'
import { useSupabaseClient } from '@/lib/supabaseContext';
import { useEffect, useState } from 'react';

export default function Notes() {
  const supabase = useSupabaseClient();
  // 클라이언트 컴포넌트이므로, 예시로 useEffect로 데이터 fetch
  // 실제로는 SWR, React Query 등 사용 권장
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('notes').select().then(({ data }) => setNotes(data ?? []));
  }, [supabase]);
  return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
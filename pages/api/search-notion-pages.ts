import type { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const keyword = (req.query.keyword || '').toString().trim();
  const page = Number.parseInt((req.query.page as string) || '1', 10);
  const pageSize = Number.parseInt((req.query.pageSize as string) || '12', 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const isPreview = req.query.isPreview === 'true';

  if (!keyword) {
    return res.status(200).json({ data: [], total: 0 });
  }

  // 전체 개수 카운트
  const countQuery = supabase
    .from('notion_pages')
    .select('*', { count: 'exact', head: true })
    .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    .eq('preview', isPreview);
  const { count, error: countError } = await countQuery;
  if (countError) {
    return res.status(500).json({ error: countError.message });
  }

  // 실제 데이터 쿼리
  const dataQuery = supabase
    .from('notion_pages')
    .select('*')
    .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    .range(from, to)
    .order('created_date', { ascending: false })
    .eq('preview', isPreview);
  const { data, error } = await dataQuery;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data, total: count });
}

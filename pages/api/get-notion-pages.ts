import type { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vercel preview 브랜치에서만 CORS 허더 허용
  const VERCEL_ENV = process.env.VERCEL_ENV;
  if (VERCEL_ENV === 'preview') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  // page, pageSize 쿼리 파라미터 처리
  const page = Number.parseInt((req.query.page as string) || '1', 10);
  const pageSize = Number.parseInt((req.query.pageSize as string) || '12', 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const isPreview = req.query.isPreview === 'true';

  // 전체 개수 카운트 쿼리
  const { count: countResult, error: countError } = await supabase
    .from('notion_pages')
    .select('*', { count: 'exact', head: true })
    .eq('preview', isPreview);
  if (countError) {
    return res.status(500).json({ error: countError.message });
  }

  // 실제 데이터 쿼리
  const { data: dataResult, error: dataError } = await supabase
    .from('notion_pages')
    .select('*')
    .eq('preview', isPreview)
    .order('created_date', { ascending: false })
    .range(from, to);

  if (dataError) {
    return res.status(500).json({ error: dataError.message });
  }

  res.status(200).json({ data: dataResult, total: countResult });
}

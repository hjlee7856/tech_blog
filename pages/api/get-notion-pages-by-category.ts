import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import { supabase } from '@/lib/supabaseClient';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = Number.parseInt((req.query.page as string) || '1', 10);
  const pageSize = Number.parseInt((req.query.pageSize as string) || '12', 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { category } = req.query;
  const isPreview = req.query.isPreview === 'true';

  if (isPreview) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }

  // 전체 개수 카운트 쿼리
  let count = 0;
  let countError = null;

  if (category === '전체') {
    const countQuery = supabase
      .from('notion_pages')
      .select('*', { count: 'exact', head: true })
      .eq('preview', isPreview);
    const { count: total, error: cErr } = await countQuery;
    count = total || 0;
    countError = cErr;
  } else if (typeof category === 'string') {
    const countQuery = supabase
      .from('notion_pages')
      .select('*', { count: 'exact', head: true })
      .eq('category', category)
      .eq('preview', isPreview);
    const { count: total, error: cErr } = await countQuery;
    count = total || 0;
    countError = cErr;
  } else {
    return res.status(400).json({ error: '카테고리 파라미터 형식이 올바르지 않습니다.' });
  }

  if (countError) {
    return res.status(500).json({ error: countError.message });
  }

  // 실제 데이터 쿼리
  let data, error;
  if (category === '전체') {
    const dataQuery = supabase
      .from('notion_pages')
      .select('*')
      .range(from, to)
      .order('created_date', { ascending: false })
      .eq('preview', isPreview);
    const result = await dataQuery;
    data = result.data;
    error = result.error;
  } else if (typeof category === 'string') {
    const dataQuery = supabase
      .from('notion_pages')
      .select('*')
      .eq('category', category)
      .range(from, to)
      .order('created_date', { ascending: false })
      .eq('preview', isPreview);
    const result = await dataQuery;
    data = result.data;
    error = result.error;
  }

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data, total: count, isPreview });
}

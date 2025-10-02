import type { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '@/lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Vercel preview 브랜치에서만 CORS 허더 허용
  const VERCEL_ENV = process.env.VERCEL_ENV
  if (VERCEL_ENV === 'preview') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  const { data, error } = await supabase
    .from('notion_categories')
    .select('category, order')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json(data)
}

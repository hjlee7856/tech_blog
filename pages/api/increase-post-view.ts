import type { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '@/lib/supabaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method Not Allowed' })
  }

  const { page_id } = req.body

  if (!page_id || typeof page_id !== 'string') {
    return res
      .status(400)
      .json({ success: false, message: 'page_id is required' })
  }

  try {
    const { data: before, error: err1 } = await supabase
      .from('notion_pages')
      .select('view_count')
      .eq('id', page_id)
      .single()

    if (err1 && err1.code !== 'PGRST116') {
      throw new Error(err1?.message || 'DB error')
    }

    let data, error
    if (before) {
      const { data: updated, error: updateError } = await supabase
        .from('notion_pages')
        .update({ view_count: before.view_count + 1 })
        .eq('id', page_id)
        .select('view_count')
        .single()
      data = updated
      error = updateError
    }
    if (error) throw error
    return res
      .status(200)
      .json({ success: true, view_count: data?.view_count ?? null })
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Unknown error' })
  }
}

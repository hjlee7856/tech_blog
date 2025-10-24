import { unstable_cache } from 'next/cache';

import type { NotionPage } from '@/lib/notion-page';
import { supabase } from '@/lib/supabaseClient';

export interface NotionPagesResult {
  data: NotionPage[];
  total: number;
}

const getNotionPagesUncached = async (
  isClient?: boolean,
  page = 1,
  pageSize = 12,
): Promise<NotionPagesResult> => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { count: countResult, error: countError } = await supabase
      .from('notion_pages')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Count error: ${countError.message}`);
    }

    const { data: dataResult, error: dataError } = await supabase
      .from('notion_pages')
      .select('*')
      .order('post_id', { ascending: false })
      .range(from, to);

    if (dataError) {
      throw new Error(`Data error: ${dataError.message}`);
    }

    return { data: dataResult as NotionPage[], total: countResult || 0 };
  } catch (err: any) {
    console.error('getNotionPages error:', err);
    return { data: [], total: 0 };
  }
};

export const getNotionPages = unstable_cache(getNotionPagesUncached, ['getNotionPages'], {
  revalidate: 3600,
});

import type { NotionPage } from '@/lib/notion-page';
import { supabase } from '@/lib/supabaseClient';

export interface SearchNotionPagesResult {
  data: NotionPage[];
  total: number;
}

export const getSearchedNotionPages = async (
  keyword: string,
  page = 1,
  pageSize = 12,
): Promise<SearchNotionPagesResult> => {
  if (!keyword) return { data: [], total: 0 };
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { count: countResult, error: countError } = await supabase
      .from('notion_pages')
      .select('*', { count: 'exact', head: true })
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);

    if (countError) {
      throw new Error(`Count error: ${countError.message}`);
    }

    const { data: dataResult, error: dataError } = await supabase
      .from('notion_pages')
      .select('*')
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .order('created_date', { ascending: false })
      .range(from, to);

    if (dataError) {
      throw new Error(`Data error: ${dataError.message}`);
    }

    return { data: dataResult as NotionPage[], total: countResult || 0 };
  } catch (err: any) {
    console.error('getSearchedNotionPages error:', err);
    return { data: [], total: 0 };
  }
};

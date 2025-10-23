import type { NotionPage } from '../lib/notion-page';
import { supabase } from '@/lib/supabaseClient';

export interface NotionPagesByCategoryResult {
  data: NotionPage[];
  total: number;
}

export const handleNotionPagesByCategory = async (
  category: string,
  page = 1,
  pageSize = 12,
): Promise<NotionPagesByCategoryResult> => {
  if (!category.trim()) return { data: [], total: 0 };
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { count: countResult, error: countError } = await supabase
      .from('notion_pages')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    if (countError) {
      throw new Error(`Count error: ${countError.message}`);
    }

    const { data: dataResult, error: dataError } = await supabase
      .from('notion_pages')
      .select('*')
      .eq('category', category)
      .order('created_date', { ascending: false })
      .range(from, to);

    if (dataError) {
      throw new Error(`Data error: ${dataError.message}`);
    }

    return { data: dataResult as NotionPage[], total: countResult || 0 };
  } catch (err: any) {
    console.error('handleNotionPagesByCategory error:', err);
    return { data: [], total: 0 };
  }
};

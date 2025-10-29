import { unstable_cache } from 'next/cache';

import { supabase } from '@/lib/supabaseClient';

type NotionCategory = {
  category: string;
  order: number;
  count: number;
};

const getNotionCategoriesUncached = async (): Promise<NotionCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('notion_categories')
      .select('category, order, count');

    if (error) {
      throw new Error(`Categories error: ${error.message}`);
    }

    return data as NotionCategory[];
  } catch (err: any) {
    console.error('getNotionCategories error:', err);
    return [];
  }
};

export const getNotionCategories = unstable_cache(
  getNotionCategoriesUncached,
  ['getNotionCategories'],
  { revalidate: 3600 },
);

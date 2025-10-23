import { unstable_cache } from 'next/cache';

import { supabase } from '@/lib/supabaseClient';

const getNotionCategoriesUncached = async (): Promise<{ category: string; order: number }[]> => {
  try {
    const { data, error } = await supabase.from('notion_categories').select('category, order');

    if (error) {
      throw new Error(`Categories error: ${error.message}`);
    }

    return data as { category: string; order: number }[];
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

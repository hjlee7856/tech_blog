import { supabase } from '@/lib/supabaseClient';

export async function increaseNotionView(pageId: string): Promise<boolean> {
  if (!pageId || typeof pageId !== 'string') {
    return false;
  }

  try {
    const { data: before, error: err1 } = await supabase
      .from('notion_pages')
      .select('view_count')
      .eq('id', pageId)
      .single();

    if (err1 && err1.code !== 'PGRST116') {
      throw new Error(err1?.message || 'DB error');
    }

    if (!before) {
      return false;
    }

    const { data: updated, error: updateError } = await supabase
      .from('notion_pages')
      .update({ view_count: before.view_count + 1 })
      .eq('id', pageId)
      .select('view_count')
      .single();

    if (updateError) {
      throw updateError;
    }

    return !!updated;
  } catch (err: any) {
    console.error('increaseNotionView error:', err);
    return false;
  }
}

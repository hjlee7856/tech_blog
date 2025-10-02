import Cookies from 'js-cookie';

import type { NotionPage } from '@/lib/notion-page';

export const getSearchedNotionPages = async (
  keyword: string,
  page = 1,
  pageSize = 12,
  isPreview = false,
): Promise<{ data: NotionPage[]; total: number }> => {
  if (!keyword) return { data: [], total: 0 };
  try {
    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      pageSize: pageSize.toString(),
      isPreview: isPreview.toString(),
    });
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (isPreview) {
      const token = Cookies.get('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    const res = await fetch(`/api/search-notion-pages?${params.toString()}`, {
      headers,
    });
    if (!res.ok) throw new Error('Failed to fetch searched notion pages');
    const result = await res.json();
    return result as { data: NotionPage[]; total: number };
  } catch (err: any) {
    console.error(err.message);
    return { data: [], total: 0 };
  }
};

// 검색 처리 함수
export const handleNotionPagesSearch = async (
  searchTerm: string,
  page: number,
  pageSize: number,
  setLoading: (loading: boolean) => void,
  setItems: (items: NotionPage[]) => void,
  setTotal: (total: number) => void,
  isPreview = false,
): Promise<void> => {
  if (!searchTerm.trim()) return;

  setLoading(true);
  try {
    const result = await getSearchedNotionPages(searchTerm, page, pageSize, isPreview);
    setItems(result.data);
    setTotal(result.total);
  } catch (err) {
    console.error('검색 오류:', err);
    setItems([]);
    setTotal(0);
  } finally {
    setLoading(false);
  }
};

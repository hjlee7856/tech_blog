import Cookies from 'js-cookie';

import type { NotionPage } from '../lib/notion-page';
// 카테고리별 페이지네이션 처리 함수
export const handleNotionPagesByCategory = async (
  category: string,
  page = 1,
  pageSize = 12,
  isPreview = false,
): Promise<{ data: NotionPage[]; total: number }> => {
  if (!category.trim()) return { data: [], total: 0 };
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (isPreview) {
      const token = Cookies.get('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await fetch(
      `/api/get-notion-pages-by-category?category=${encodeURIComponent(category)}&page=${page}&pageSize=${pageSize}&isPreview=${isPreview}`,
      {
        headers,
      },
    );
    if (!res.ok) throw new Error('Failed to fetch notion pages by category');
    const result = await res.json();
    return result as { data: NotionPage[]; total: number };
  } catch (err: any) {
    console.error('카테고리 오류:', err);
    return { data: [], total: 0 };
  }
};

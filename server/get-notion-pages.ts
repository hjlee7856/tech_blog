import type { NotionPage } from '@/lib/notion-page';

export interface NotionPagesResult {
  data: NotionPage[];
  total: number;
}

export const getNotionPages = async (
  isClient?: boolean,
  page = 1,
  pageSize = 12,
  isPreview = false,
): Promise<NotionPagesResult> => {
  try {
    let baseUrl = '';
    if (!isClient) {
      baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    }
    const res = await fetch(
      `${baseUrl}/api/get-notion-pages?page=${page}&pageSize=${pageSize}&isPreview=${isPreview}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    if (!res.ok) throw new Error('Failed to fetch notion pages');
    const result = await res.json();
    return result as NotionPagesResult;
  } catch (err: any) {
    console.error(err.message);
    return { data: [], total: 0 };
  }
};

export const getNotionCategories = async (
  isClient?: boolean,
): Promise<{ category: string; order: number }[]> => {
  try {
    let baseUrl = '';
    if (!isClient) {
      baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    }
    const res = await fetch(`${baseUrl}/api/get-notion-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch notion categories');
    const data = await res.json();
    return data as { category: string; order: number }[];
  } catch (err: any) {
    console.error(err.message);
    return [];
  }
};

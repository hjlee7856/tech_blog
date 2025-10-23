import { type NextRequest, NextResponse } from 'next/server';

import { getNotionPages } from '@/server/get-notion-pages';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '12', 10);

    const result = await getNotionPages(true, page, pageSize);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ data: [], total: 0 }, { status: 500 });
  }
}

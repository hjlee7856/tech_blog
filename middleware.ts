import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

// 미들웨어는 Edge Runtime에서 실행되므로, 환경 변수를 직접 사용합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 정적 파일, API 라우트 등 미들웨어를 적용하지 않을 경로를 제외합니다.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // 파일 확장자를 포함하는 경로는 무시합니다. (e.g., .png, .ico, .json)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // /preview/post 경로만 처리합니다.
  if (pathname !== '/post' && pathname !== '/preview/post') {
    return NextResponse.next();
  }

  const postId = searchParams.get('post_id');

  // post_id가 없거나 숫자가 아니면 다음으로 넘어갑니다.
  if (!postId || Number.isNaN(Number.parseInt(postId, 10))) {
    return NextResponse.next();
  }

  // Supabase 클라이언트를 미들웨어 내에서 생성합니다.
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // 'pages' 테이블에서 'post_id'가 slug와 일치하는 'id'를 찾습니다.
    const { data, error } = await supabase
      .from('notion_pages')
      .select('id') // 실제 Notion 페이지 ID
      .eq('post_id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 일치하는 post_id가 없는 경우, 404 페이지로 재작성할 수 있습니다.
        // 혹은 그냥 next()를 호출하여 post.tsx에서 처리하게 할 수도 있습니다.
        return NextResponse.next();
      }
      throw error;
    }

    if (data && data.id) {
      // URL은 그대로 두고, 헤더에 필요한 정보를 추가하여 요청을 재작성합니다.
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-page-id', data.id); // 실제 Notion 페이지 ID
      requestHeaders.set('x-post-id', postId); // 사용자가 보는 ID

      return NextResponse.rewrite(req.nextUrl, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  } catch (err) {
    console.error('Error in middleware:', err);
  }

  // 일치하는 post_id가 없으면 요청을 그대로 진행합니다.
  return NextResponse.next();
}

export const config = {
  // 미들웨어가 실행될 경로를 지정합니다.
  // 여기서는 모든 경로에서 실행하되, 위에서 특정 경로들을 제외하는 방식을 사용합니다.
  matcher: '/:path*',
};

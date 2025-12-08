import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // bingo-genshin-impact.vercel.app 도메인에서 루트 접근 시 리다이렉트
  if (hostname.includes('bingo-genshin-impact') && pathname === '/') {
    return NextResponse.redirect(new URL('/genshin-impact-bingo', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};

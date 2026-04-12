import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  if (!request.nextUrl.pathname.startsWith('/embed')) {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  return response;
}

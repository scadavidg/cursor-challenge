import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session-token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/favorites'];
  const authRoutes = ['/login', '/signup'];

  if (!sessionToken && protectedRoutes.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionToken && authRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/favorites', '/login', '/signup'],
}

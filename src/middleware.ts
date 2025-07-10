import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session-token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/home', '/favorites', '/explore'];
  const authRoutes = ['/login', '/signup'];

  // Handle root path redirect
  if (pathname === '/') {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (!sessionToken && protectedRoutes.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionToken && authRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home', '/favorites', '/explore', '/login', '/signup'],
}

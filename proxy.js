import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

const withSecurityHeaders = (res) => {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
};

/**
 * Guards the member area and applies baseline security headers.
 *
 * The cookie is only checked for presence here, since this layer cannot verify
 * the Core JWT. Pages and route handlers still validate it against Core, so
 * this is a cheap first gate that also makes new dashboard routes protected by
 * default rather than by remembering to add a check.
 */
export function proxy(req) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && !req.cookies.get(SESSION_COOKIE)?.value) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', `${pathname}${search}`);
    return withSecurityHeaders(NextResponse.redirect(login));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|assets|.*\\.[\\w]+$).*)',
  ],
};

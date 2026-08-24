import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if trying to access /admin (but not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const hasSession = request.cookies.has('creafy_cms_session');

    if (!hasSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If going to login page but already has session, redirect to dashboard
  if (pathname === '/admin/login') {
    const hasSession = request.cookies.has('creafy_cms_session');

    if (hasSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

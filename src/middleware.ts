import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if trying to access /admin (but not /workshop-creafy/login)
  if (pathname.startsWith('/workshop-creafy') && pathname !== '/workshop-creafy/login') {
    const hasSession = request.cookies.has('creafy_cms_session');

    if (!hasSession) {
      return NextResponse.redirect(new URL('/workshop-creafy/login', request.url));
    }
  }

  // If going to login page but already has session, redirect to dashboard
  if (pathname === '/workshop-creafy/login') {
    const hasSession = request.cookies.has('creafy_cms_session');

    if (hasSession) {
      return NextResponse.redirect(new URL('/workshop-creafy', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workshop-creafy/:path*'],
};

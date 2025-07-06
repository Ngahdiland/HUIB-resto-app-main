import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that don't require authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/_next',
  '/favicon.ico',
  '/images',
  '/public',
  '/api/auth', // allow API auth routes
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for JWT token in cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Not authenticated, redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|public|api/auth).*)', // Protect all except public paths
  ],
};

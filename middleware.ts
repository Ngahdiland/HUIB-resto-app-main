import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/_next',
  '/favicon.ico',
  '/images',
  '/public',
  '/api/auth', // allow API auth routes
  '/api/products', // allow public product access
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

  // Check for JWT token in Authorization header or cookies
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

  // For now, allow all routes without strict authentication
  // This can be enhanced later with proper JWT verification
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|public|api/auth).*)', // Protect all except public paths
  ],
};

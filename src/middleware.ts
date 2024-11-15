import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add auth pages that don't require authentication
const authPages = ['/auth/login', '/auth/signup', '/auth/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is an auth page
  const isAuthPage = authPages.some(page => pathname.startsWith(page));
  
  // Get the token from the cookies
  const token = request.cookies.get('session');

  // If the path is an auth page and user is logged in,
  // redirect to home page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the path is not an auth page and user is not logged in,
  // redirect to login page
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

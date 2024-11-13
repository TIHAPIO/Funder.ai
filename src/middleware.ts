import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Temporarily bypass authentication for development
  return NextResponse.next();

  /* Original authentication logic
  const { pathname } = request.nextUrl;

  // List of public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/reset-password'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Get the Firebase ID token from the Authorization header
  const token = request.cookies.get('firebaseToken')?.value;

  // If the path is private and there's no token, redirect to login
  if (!isPublicPath && !token && !pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If the path is public and there's a token, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

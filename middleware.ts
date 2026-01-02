import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware for Next.js
 * 
 * Note: With a separate backend handling auth, we can't check auth state
 * in middleware (tokens are stored client-side in localStorage).
 * 
 * Protected route handling is done client-side in components.
 */
export async function middleware(request: NextRequest) {
  // Just pass through - auth checking happens client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - API routes that don't need auth check
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


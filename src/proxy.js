import { NextResponse } from 'next/server';

// Optimistic check only: a visitor with no access-token cookie is sent to the
// login page before any dashboard HTML is served. The token itself is verified
// by the API on every request, and DashboardLayout repeats this check in the
// browser.
export function proxy(request) {
  if (!request.cookies.get('accessToken')?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};

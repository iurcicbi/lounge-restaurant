import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getAuthSecret } from '@/lib/env';

const proxy = withAuth(
  function adminGate() {
    return NextResponse.next();
  },
  {
    secret: getAuthSecret(),
    pages: { signIn: '/admin/login' },
    callbacks: {
      authorized: ({ req, token }) =>
        req.nextUrl.pathname.startsWith('/admin/login') || token?.role === 'admin' || token?.role === 'concierge'
    }
  }
);

export default proxy;

export const config = {
  matcher: ['/admin/:path*']
};

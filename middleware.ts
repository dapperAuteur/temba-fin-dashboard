import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const protectedRoutes = ['/dashboard', '/accounts', '/transactions'];
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/accounts/:path*', '/transactions/:path*'],
};

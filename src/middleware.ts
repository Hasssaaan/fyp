import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ['/login', '/signup', '/verifyemail'];

  const token = request.cookies.get('token')?.value;

  // If user has token and tries to access public path, redirect to role-based dashboard
  if (token && publicPaths.includes(path)) {
    try {
      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);

      if (decoded.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (decoded.role === 'freelancer') {
        return NextResponse.redirect(new URL('/freelancer', request.url));
      } else if (decoded.role === 'client') {
        return NextResponse.redirect(new URL('/client', request.url));
      } else {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If user doesn't have token and trying to access protected route
  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin', '/freelancer', '/client', '/profile', '/login', '/signup', '/verifyemail'],
};

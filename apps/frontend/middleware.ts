import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;

  // ถ้า "ไม่มี token" แต่อยากเข้าหน้าที่ต้องล็อกอิน -> เตะกลับไปหน้า "/login"
  if (!token && (path.startsWith('/account') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // /login, /register, /products ฯลฯ เป็น public routes -> ปล่อยผ่านเสมอ
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. ให้ยาม (Middleware) แอบดูด Cookie ที่ชื่อ access_token ขึ้นมาเช็ค
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;

  // 🔴 กฎข้อที่ 1: ถ้า "ไม่มีกุญแจ" แต่อยากเข้าหน้า "/dashboard" -> เตะกลับไปหน้า "/login" ทันทีตั้งแต่ยังไม่โหลดหน้าเว็บ!
  if (!token && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🟢 กฎข้อที่ 2: ถ้า "มีกุญแจแล้ว" (ล็อคอินแล้ว) แต่เผลอเข้าหน้า "/login" หรือ "/register" -> เด้งไป "/dashboard" ทันที!
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ถ้าไม่ผิดกฎอะไรเลย ก็ปล่อยผ่านไปโหลดหน้าเว็บตามปกติ
  return NextResponse.next();
}

// ตั้งค่าว่าให้ด่านตรวจนี้ ทำงานเฉพาะกับ URL ไหนบ้าง (เพื่อไม่ให้เปลืองทรัพยากรเครื่อง)
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
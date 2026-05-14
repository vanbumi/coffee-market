import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware untuk melindungi route /admin/*
 * Menggunakan cookie-based authentication (admin_auth)
 * Route /admin/login tidak diproteksi
 */
export function middleware(request: NextRequest) {
  // Lewati proteksi untuk halaman login
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Hanya proteksi route admin
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Cek cookie admin_auth
  const adminAuth = request.cookies.get('admin_auth');

  if (adminAuth?.value === 'true') {
    // User terautentikasi, lanjutkan
    return NextResponse.next();
  }

  // Tidak terautentikasi, redirect ke halaman login
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = {
  matcher: '/admin/:path*',
};

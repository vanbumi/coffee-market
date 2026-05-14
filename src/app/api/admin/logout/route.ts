import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint untuk logout admin
 * POST /api/admin/logout
 * Menghapus cookie admin_auth dan redirect ke /admin/login
 */
export async function POST(_request: NextRequest) {
  // Buat redirect response ke halaman login
  const response = NextResponse.redirect(new URL('/admin/login', _request.url));

  // Hapus cookie admin_auth dengan mengatur maxAge = 0
  response.cookies.set('admin_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Langsung expired
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

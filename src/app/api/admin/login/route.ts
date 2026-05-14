import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint untuk login admin
 * POST /api/admin/login
 * Body: { username: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validasi credential
    const validUsername = 'admin';
    const validPassword = 'coffeemarket123';

    if (username === validUsername && password === validPassword) {
      // Buat response sukses
      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
      });

      // Set cookie admin_auth
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 hari (dalam detik)
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    // Login gagal
    return NextResponse.json(
      {
        success: false,
        message: 'Username atau password salah',
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Format request tidak valid',
      },
      { status: 400 }
    );
  }
}

'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ambil error dari query parameter (redirect dari API jika login gagal)
  const hasError = searchParams.get('error') === '1';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Login berhasil, redirect ke dashboard
        router.push('/admin/dashboard');
      } else {
        // Tampilkan error di form
        setIsLoading(false);
        // Trigger re-render untuk menampilkan error
        const errorInput = document.getElementById('login-error');
        if (errorInput) {
          errorInput.textContent = data.message || 'Username atau password salah';
          errorInput.classList.remove('hidden');
        }
      }
    } catch {
      setIsLoading(false);
      const errorInput = document.getElementById('login-error');
      if (errorInput) {
        errorInput.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorInput.classList.remove('hidden');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A2C2A] via-[#6B3A3A] to-[#8B4513] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Coffee Icon & Title */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-slow">☕</div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Admin Login
          </h1>
          <p className="text-[#D4A574] mt-2 font-medium">
            Coffee Market Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#D4A574]/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {(hasError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Username atau password salah
              </div>
            )}
            <div id="login-error" className="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span></span>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#4A2C2A] mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#D4A574]/30 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4A2C2A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#D4A574]/30 rounded-xl focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#6B3A3A] to-[#8B4513] hover:from-[#5A2D2D] hover:to-[#7A3A10] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Masuk Dashboard
                </>
              )}
            </button>
          </form>

          {/* Hint Credentials */}
          <div className="mt-6 pt-5 border-t border-[#D4A574]/20">
            <p className="text-xs text-[#8B7355] text-center">
              Gunakan username:{' '}
              <span className="font-mono font-semibold text-[#4A2C2A] bg-[#FFF8F0] px-2 py-0.5 rounded">admin</span>
              {' | '}password:{' '}
              <span className="font-mono font-semibold text-[#4A2C2A] bg-[#FFF8F0] px-2 py-0.5 rounded">coffeemarket123</span>
            </p>
          </div>
        </div>

        {/* Back to Store Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center text-sm text-[#D4A574] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A2C2A] via-[#6B3A3A] to-[#8B4513] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">☕</div>
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    </div>
  );
}

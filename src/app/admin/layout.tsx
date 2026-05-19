'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/admin/Sidebar';

/**
 * Admin layout dengan SessionProvider untuk NextAuth.
 * Halaman login ditampilkan full-width tanpa sidebar.
 * Halaman admin lainnya ditampilkan dengan sidebar + konten + footer.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  // Login page: full width, no sidebar, no footer
  if (pathname === '/admin/login') {
    return (
      <SessionProvider>
        <div className="min-h-screen bg-surface flex flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </SessionProvider>
    );
  }

  // All other admin pages: sidebar + content + footer
  return (
    <SessionProvider>
      <div className="min-h-screen bg-surface flex flex-col">
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 lg:pl-0">
            {children}
          </main>
        </div>

        {/* Admin Footer */}
        <footer className="border-t border-border bg-surface-alt">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-text-tertiary text-xs">
              &copy; {new Date().getFullYear()} Sundara EA by revaktor.com. All rights reserved.
            </p>
            <p className="text-text-tertiary text-xs">
              Crafted with ☕ and ❤️
            </p>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}

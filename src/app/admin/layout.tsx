'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';

/**
 * Admin layout dengan sidebar navigasi.
 * Halaman login ditampilkan full-width tanpa sidebar.
 * Halaman admin lainnya ditampilkan dengan sidebar + konten.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  // Login page: full width, no sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-surface">
        {children}
      </div>
    );
  }

  // All other admin pages: sidebar + content
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 lg:pl-0">
        {children}
      </main>
    </div>
  );
}

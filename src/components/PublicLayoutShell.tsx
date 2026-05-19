'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { CartProvider } from '@/context/CartContext';

/**
 * PublicLayoutShell wraps children with Navbar, Footer, and CartProvider
 * only on public (non-admin) routes. Admin routes pass through untouched
 * because they have their own Sidebar + layout in admin/layout.tsx.
 */
export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}

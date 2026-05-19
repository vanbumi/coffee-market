'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

/**
 * Komponen Sidebar untuk navigasi admin panel.
 * Menampilkan menu-menu admin dengan active state berdasarkan pathname.
 * Collapsible di mobile view. Role-based menu rendering.
 */

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | null;
  requiredRole?: 'superuser'; // hanya tampil untuk superuser
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  const role = (session?.user as { role?: string })?.role;
  const userName = session?.user?.name || 'Admin';

  // Fetch pending orders count for badge
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/orders');
        const json = await res.json();
        if (json.success) {
          const pending = json.data.filter((o: { status: string }) => o.status === 'pending').length;
          setPendingCount(pending);
        }
      } catch {
        // Silent fail
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const allSections: NavSection[] = [
    {
      title: 'Utama',
      items: [
        {
          label: 'Dashboard',
          href: '/admin/dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Produk',
      items: [
        {
          label: 'Semua Produk',
          href: '/admin/products',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          label: 'Tambah Produk',
          href: '/admin/products/add',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          ),
          requiredRole: 'superuser',
        },
        {
          label: 'Kategori & Kupon',
          href: '/admin/categories',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
          requiredRole: 'superuser',
        },
      ],
    },
    {
      title: 'Transaksi',
      items: [
        {
          label: 'Pesanan',
          href: '/admin/orders',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
          badge: pendingCount,
        },
      ],
    },
    {
      title: 'Pelanggan',
      items: [
        {
          label: 'Customer',
          href: '/admin/customers',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          label: 'Ulasan & Testimoni',
          href: '/admin/reviews',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Konten',
      items: [
        {
          label: 'Blog / Artikel',
          href: '/admin/blog',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Pengaturan',
      items: [
        {
          label: 'Pengaturan Toko',
          href: '/admin/settings',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          requiredRole: 'superuser',
        },
        {
          label: 'Laporan Detail',
          href: '/admin/reports',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          requiredRole: 'superuser',
        },
      ],
    },
  ];

  // Filter sections based on user role
  const navSections: NavSection[] = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.requiredRole) return true;
        return role === item.requiredRole;
      }),
    }))
    .filter((section) => section.items.length > 0);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo & Brand */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <Image
            src="/revaktor-logo.png"
            alt="Revaktor"
            width={120}
            height={40}
            className="h-10 w-auto flex-shrink-0 group-hover:scale-105 transition-transform"
          />
          {!isCollapsed && (
            <span className="font-bold text-text-primary text-xl leading-none">
              Revaktor
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs text-gold font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-text-primary truncate">{userName}</span>
              <span className={`text-[10px] font-semibold uppercase ${role === 'superuser' ? 'text-gold' : 'text-blue-400'}`}>
                {role === 'superuser' ? 'Superuser' : 'View Only'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive(item.href)
                      ? 'bg-gold/15 text-gold border border-gold/20 shadow-sm shadow-gold/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-card border border-transparent'
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-gold' : 'text-text-tertiary group-hover:text-text-secondary'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="ml-auto flex-shrink-0 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-card border border-transparent transition-all group"
        >
          <svg className="w-5 h-5 text-text-tertiary group-hover:text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {!isCollapsed && <span>Kembali ke Toko</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all group"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-alt border border-border text-text-secondary hover:text-gold transition-colors shadow-lg"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-surface-alt border-r border-border z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${isCollapsed ? 'w-[72px]' : 'w-60'} bg-surface-alt border-r border-border transition-all duration-300 ease-in-out relative`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-surface-alt border border-border text-text-tertiary hover:text-gold hover:border-gold/40 flex items-center justify-center transition-colors shadow-sm z-10"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

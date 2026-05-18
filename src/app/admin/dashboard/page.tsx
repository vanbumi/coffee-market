'use client';

import { useState, useEffect, useCallback } from 'react';
import SalesChart from '@/components/admin/SalesChart';

/** Tipe data order dari database */
interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  shippingCost: number;
  discount: number;
  status: string;
  paymentMethod: string | null;
  createdAt: string | null;
}

/**
 * Halaman Dashboard Utama Admin
 * Menampilkan ringkasan statistik, grafik penjualan, dan quick links
 */
export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/customers'),
      ]);

      const productsJson = await productsRes.json();
      const ordersJson = await ordersRes.json();
      const customersJson = await customersRes.json();

      if (productsJson.success) setTotalProducts(productsJson.data.length);
      if (ordersJson.success) setOrders(ordersJson.data);
      if (customersJson.success) setTotalCustomers(customersJson.data.length);
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;

  // Quick links grid
  const quickLinks = [
    { label: 'Tambah Produk', href: '/admin/products/add', icon: '➕', color: 'bg-gold/10 text-gold' },
    { label: 'Semua Produk', href: '/admin/products', icon: '📦', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Pesanan', href: '/admin/orders', icon: '📋', color: 'bg-green-500/10 text-green-400' },
    { label: 'Customer', href: '/admin/customers', icon: '👥', color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Kategori & Kupon', href: '/admin/categories', icon: '🏷️', color: 'bg-orange-500/10 text-orange-400' },
    { label: 'Ulasan', href: '/admin/reviews', icon: '⭐', color: 'bg-yellow-500/10 text-yellow-400' },
    { label: 'Blog', href: '/admin/blog', icon: '📝', color: 'bg-pink-500/10 text-pink-400' },
    { label: 'Pengaturan', href: '/admin/settings', icon: '⚙️', color: 'bg-gray-500/10 text-gray-400' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">🏠 Dashboard</h1>
              <p className="text-sm text-text-secondary mt-1">
                Ringkasan bisnis kopi Sundara Coffee
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-surface-card hover:bg-surface-hover border border-border rounded-lg transition-all"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Toko
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-alt rounded-xl border border-border p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 bg-surface-hover rounded w-20" />
                      <div className="h-7 bg-surface-hover rounded w-12" />
                    </div>
                    <div className="w-10 h-10 bg-surface-hover rounded-lg" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Total Produk</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{totalProducts}</p>
                  </div>
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <span className="text-gold text-lg">📦</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Total Pesanan</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{orders.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-lg">📋</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Pesanan Pending</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{pendingOrders}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 text-lg">⏳</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Total Customer</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{totalCustomers}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-lg">👥</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{formatPrice(totalRevenue)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-lg">💰</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Sedang Diproses</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{processingOrders}</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-orange-400 text-lg">🔄</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sales Chart */}
        <div className="mb-6">
          <SalesChart orders={orders} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="bg-surface-alt rounded-xl border border-border p-4 hover:border-gold/30 hover:shadow-sm hover:shadow-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${link.color}`}>
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-gold transition-colors">
                  {link.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

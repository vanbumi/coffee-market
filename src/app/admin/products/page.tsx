'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import ProductManagement from '@/components/admin/ProductManagement';

/**
 * Halaman Kelola Semua Produk (Admin)
 * Menampilkan daftar semua produk dari database dengan fitur pencarian & hapus
 */
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Produk berhasil dihapus');
        fetchProducts();
      } else {
        showNotification('error', json.message || 'Gagal menghapus produk');
      }
    } catch (error) {
      showNotification('error', 'Gagal menghapus produk');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">📦 Semua Produk</h1>
              <p className="text-sm text-text-secondary mt-1">
                Kelola dan pantau semua produk kopi
              </p>
            </div>
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
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-between backdrop-blur-sm ${
              notification.type === 'success'
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-current opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Product List */}
        <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Daftar Produk
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Semua produk kopi yang tersedia di katalog
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/admin/products/add"
                className="px-4 py-2 bg-gold hover:bg-gold-light text-black rounded-lg font-semibold text-sm transition-all shadow-sm shadow-gold/20 hover:shadow-gold/30 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
              </a>
              <button
                onClick={fetchProducts}
                className="p-2 text-text-tertiary hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse flex items-center gap-4 border border-border">
                  <div className="w-16 h-16 bg-surface-hover rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-hover rounded w-1/3" />
                    <div className="h-3 bg-surface-hover rounded w-1/4" />
                  </div>
                  <div className="w-8 h-8 bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <ProductManagement
              products={products}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/db/schema';
import CustomerManagement from '@/components/admin/CustomerManagement';

/**
 * Halaman Manajemen Customer (Admin)
 * Menampilkan daftar semua customer dengan fitur pencarian & hapus
 */
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/customers');
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data customer:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      const res = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', json.message || 'Customer berhasil dihapus');
        fetchCustomers();
      } else {
        showNotification('error', json.message || 'Gagal menghapus customer');
      }
    } catch (error) {
      showNotification('error', 'Gagal menghapus customer');
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">👥 Customer</h1>
              <p className="text-sm text-text-secondary mt-1">
                Kelola dan pantau data pelanggan
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Customer</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{customers.length}</p>
              </div>
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                <span className="text-gold text-lg">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Daftar Customer
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Semua pelanggan yang telah melakukan pemesanan
              </p>
            </div>
            <button
              onClick={fetchCustomers}
              className="p-2 text-text-tertiary hover:text-gold hover:bg-gold/10 rounded-lg transition-all"
              title="Refresh data"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse flex items-center gap-4 border border-border">
                  <div className="w-10 h-10 bg-surface-hover rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-hover rounded w-1/3" />
                    <div className="h-3 bg-surface-hover rounded w-1/2" />
                  </div>
                  <div className="w-8 h-8 bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <CustomerManagement
              customers={customers}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}
        </div>
      </div>
    </div>
  );
}

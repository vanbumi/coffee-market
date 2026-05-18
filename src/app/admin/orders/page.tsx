'use client';

import { useState, useEffect, useCallback } from 'react';

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
 * Halaman Manajemen Pesanan (Admin)
 * Menampilkan tabel semua pesanan, ringkasan penjualan, dan update status
 */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil pesanan:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-surface-hover text-text-secondary border-border-hover';
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', `Status pesanan diperbarui menjadi "${newStatus}"`);
        fetchOrders();
      } else {
        showNotification('error', json.message || 'Gagal memperbarui status');
      }
    } catch {
      showNotification('error', 'Gagal memperbarui status pesanan');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">📋 Pesanan</h1>
              <p className="text-sm text-text-secondary mt-1">
                Kelola dan pantau semua pesanan masuk
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-alt rounded-xl border border-border p-4">
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
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-lg">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Pending</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{pendingCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 text-lg">⏳</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Selesai</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{deliveredCount}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-lg">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Daftar Pesanan
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={fetchOrders}
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
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-hover rounded w-1/3" />
                    <div className="h-3 bg-surface-hover rounded w-1/4" />
                  </div>
                  <div className="w-20 h-8 bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📋</div>
              <p className="text-text-secondary text-lg">Tidak ada pesanan</p>
              <p className="text-text-tertiary text-sm mt-1">
                {statusFilter === 'all'
                  ? 'Pesanan akan muncul setelah pelanggan melakukan checkout'
                  : `Tidak ada pesanan dengan status "${statusFilter}"`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Order #</th>
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Pelanggan</th>
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Total</th>
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Tanggal</th>
                    <th className="text-left py-3 px-2 text-text-secondary font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-surface-card transition-colors"
                    >
                      <td className="py-3 px-2">
                        <span className="text-gold font-mono text-xs">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-text-primary font-medium">{order.customerName}</p>
                          <p className="text-text-tertiary text-xs">{order.customerPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-text-primary font-semibold">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${getStatusStyle(order.status)} disabled:opacity-50 disabled:cursor-wait`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-text-secondary text-xs">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 px-2">
                        {updatingId === order.id && (
                          <svg className="animate-spin h-4 w-4 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

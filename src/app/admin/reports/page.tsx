'use client';

import { useState, useEffect, useCallback } from 'react';

/** Tipe data order */
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

/** Filter state */
interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  status: string;
  productId: string;
}

/**
 * Halaman Laporan Detail (Admin)
 * Filter advance, ringkasan, chart, dan export CSV
 */
export default function AdminReportsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    productId: 'all',
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const ordersRes = await fetch('/api/orders');
      const ordersJson = await ordersRes.json();
      if (ordersJson.success) setOrders(ordersJson.data);
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filters.status !== 'all' && o.status !== filters.status) return false;
    if (filters.dateFrom && o.createdAt && new Date(o.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && o.createdAt) {
      const toDate = new Date(filters.dateTo);
      toDate.setDate(toDate.getDate() + 1);
      if (new Date(o.createdAt) >= toDate) return false;
    }
    return true;
  });

  // Aggregations
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const totalShipping = filteredOrders.reduce((sum, o) => sum + o.shippingCost, 0);
  const totalDiscount = filteredOrders.reduce((sum, o) => sum + o.discount, 0);

  // Status distribution
  const statusDistribution = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    shipped: filteredOrders.filter(o => o.status === 'shipped').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  /** Export CSV */
  const exportCSV = () => {
    if (filteredOrders.length === 0) {
      showNotification('error', 'Tidak ada data untuk diexport');
      return;
    }
    const headers = ['Order #', 'Pelanggan', 'Telepon', 'Alamat', 'Total', 'Ongkir', 'Diskon', 'Status', 'Tanggal'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      `"${(o.customerAddress || '').replace(/"/g, '""')}"`,
      o.totalAmount,
      o.shippingCost,
      o.discount,
      o.status,
      o.createdAt || '',
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-pesanan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'CSV berhasil di-download!');
  };

  /** Simulate PDF export */
  const exportPDF = () => {
    showNotification('success', 'Fitur PDF akan tersedia dengan library jspdf. Saat ini gunakan export CSV.');
  };

  const maxStatusValue = Math.max(...Object.values(statusDistribution), 1);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">📈 Laporan Detail</h1>
              <p className="text-sm text-text-secondary mt-1">Filter advance, ringkasan penjualan, dan export data</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportCSV} className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Export CSV
              </button>
              <button onClick={exportPDF} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center justify-between ${notification.type === 'success' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-surface-alt rounded-xl border border-border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Dari Tanggal</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters(p => ({ ...p, dateFrom: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Sampai Tanggal</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters(p => ({ ...p, dateTo: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Status</label>
              <select value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none">
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={fetchData} className="w-full px-4 py-2 bg-surface-card border border-border hover:border-gold/30 text-text-secondary hover:text-gold rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="bg-surface-alt rounded-xl border border-border p-6 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/3 mb-3" /><div className="h-8 bg-surface-hover rounded" /></div>)}</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Total Pesanan</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{filteredOrders.length}</p>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Rata-rata Pesanan</p>
                <p className="text-2xl font-bold text-gold mt-1">{formatPrice(avgOrderValue)}</p>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Total Diskon</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{formatPrice(totalDiscount)}</p>
              </div>
            </div>

            {/* Status Distribution Bar */}
            <div className="bg-surface-alt rounded-xl border border-border p-6 mb-6">
              <h3 className="text-text-primary font-semibold mb-4">Distribusi Status Pesanan</h3>
              <div className="space-y-3">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-text-secondary capitalize">{status}</span>
                    <div className="flex-1 bg-surface rounded-full h-5 overflow-hidden border border-border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'delivered' ? 'bg-green-500' :
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'processing' ? 'bg-blue-500' :
                          status === 'shipped' ? 'bg-purple-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${maxStatusValue > 0 ? (count / maxStatusValue) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-text-primary font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Total Ongkir</p>
                <p className="text-xl font-bold text-blue-400 mt-1">{formatPrice(totalShipping)}</p>
              </div>
              <div className="bg-surface-alt rounded-xl border border-border p-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider">Pendapatan Bersih (excl. ongkir)</p>
                <p className="text-xl font-bold text-green-400 mt-1">{formatPrice(totalRevenue - totalShipping)}</p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-surface-alt rounded-xl border border-border p-6">
              <h3 className="text-text-primary font-semibold mb-4">
                Detail Pesanan ({filteredOrders.length})
              </h3>
              {filteredOrders.length === 0 ? (
                <p className="text-text-tertiary text-sm text-center py-8">Tidak ada data yang sesuai dengan filter</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-text-secondary font-medium text-xs">Order #</th>
                        <th className="text-left py-2 px-2 text-text-secondary font-medium text-xs">Pelanggan</th>
                        <th className="text-right py-2 px-2 text-text-secondary font-medium text-xs">Total</th>
                        <th className="text-right py-2 px-2 text-text-secondary font-medium text-xs">Ongkir</th>
                        <th className="text-center py-2 px-2 text-text-secondary font-medium text-xs">Status</th>
                        <th className="text-right py-2 px-2 text-text-secondary font-medium text-xs">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="border-b border-border/50 hover:bg-surface-card transition-colors">
                          <td className="py-2 px-2 text-gold font-mono text-xs">{o.orderNumber}</td>
                          <td className="py-2 px-2 text-text-primary text-xs">{o.customerName}</td>
                          <td className="py-2 px-2 text-text-primary text-xs text-right font-semibold">{formatPrice(o.totalAmount)}</td>
                          <td className="py-2 px-2 text-text-secondary text-xs text-right">{formatPrice(o.shippingCost)}</td>
                          <td className="py-2 px-2 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              o.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                              o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                              o.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>{o.status}</span>
                          </td>
                          <td className="py-2 px-2 text-text-tertiary text-xs text-right">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

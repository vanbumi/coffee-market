'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/db/schema';

/**
 * Halaman Moderasi Ulasan & Testimoni (Admin)
 * Menampilkan semua review dari database dengan fitur approve/reject/delete
 */
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reviews');
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data review:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', `Review ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
        fetchReviews();
      } else {
        showNotification('error', json.message || 'Gagal memperbarui review');
      }
    } catch (error) {
      showNotification('error', 'Gagal memperbarui review');
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Review berhasil dihapus');
        fetchReviews();
      } else {
        showNotification('error', json.message || 'Gagal menghapus review');
      }
    } catch (error) {
      showNotification('error', 'Gagal menghapus review');
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = statusFilter === 'all' ? reviews : reviews.filter(r => r.status === statusFilter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-gold' : 'text-text-tertiary/30'}>★</span>
    ));
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">⭐ Ulasan & Testimoni</h1>
              <p className="text-sm text-text-secondary mt-1">
                Moderasi ulasan dari pelanggan
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-alt rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Ulasan</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{reviews.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">💬</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-yellow-500/30 p-4">
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
          <div className="bg-surface-alt rounded-xl border border-green-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Disetujui</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{approvedCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-lg">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl border border-red-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Ditolak</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{rejectedCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-lg">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="bg-surface-alt rounded-xl border border-border p-6 shadow-sm shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Daftar Ulasan
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Semua ulasan dan testimoni dari pelanggan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={fetchReviews}
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
                  <div className="w-10 h-10 bg-surface-hover rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-hover rounded w-1/3" />
                    <div className="h-3 bg-surface-hover rounded w-1/2" />
                  </div>
                  <div className="w-8 h-8 bg-surface-hover rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-30">⭐</div>
              <p className="text-text-secondary text-lg">Tidak ada ulasan</p>
              <p className="text-text-tertiary text-sm mt-1">
                {statusFilter !== 'all'
                  ? `Tidak ada ulasan dengan status "${statusFilter}"`
                  : 'Ulasan dari pelanggan akan muncul di sini'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map(review => (
                <div key={review.id} className="bg-surface-card border border-border rounded-lg p-4 hover:border-gold/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-text-primary text-sm">{review.customerName}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyle(review.status ?? 'pending')}`}>
                            {(review.status ?? 'pending').charAt(0).toUpperCase() + (review.status ?? 'pending').slice(1)}
                          </span>
                        </div>
                        {review.productName && (
                          <p className="text-xs text-gold mt-1">Produk: {review.productName}</p>
                        )}
                        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-text-tertiary mt-2">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {review.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(review.id, 'approved')} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Setujui">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                          <button onClick={() => handleUpdateStatus(review.id, 'rejected')} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Tolak">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(review.id)} className="p-2 text-text-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

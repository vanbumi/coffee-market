'use client';

import { useState, useEffect, useCallback } from 'react';

/** Tipe data review */
interface Review {
  id: number;
  productId: number;
  productName: string | null;
  customerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string | null;
}

/**
 * Halaman Moderasi Ulasan & Testimoni (Admin)
 * Menampilkan semua review dengan fitur approve/reject/delete
 */
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reviews');
      const json = await res.json();
      if (json.success) setReviews(json.data);
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

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
      if (res.ok && json.success) { showNotification('success', `Review ${status === 'approved' ? 'disetujui' : 'ditolak'}`); fetchReviews(); }
      else showNotification('error', json.message || 'Gagal memperbarui');
    } catch { showNotification('error', 'Gagal memperbarui review'); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', 'Review dihapus'); fetchReviews(); }
      else showNotification('error', json.message || 'Gagal menghapus');
    } catch { showNotification('error', 'Gagal menghapus review'); }
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

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">⭐ Ulasan & Testimoni</h1>
              <p className="text-sm text-text-secondary mt-1">Moderasi ulasan dari pelanggan</p>
            </div>
            {pendingCount > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                {pendingCount} menunggu review
              </span>
            )}
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

        {/* Stats + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <div className="bg-surface-alt border border-border rounded-lg px-4 py-2 text-sm">
              <span className="text-text-secondary">Total: </span>
              <span className="text-text-primary font-semibold">{reviews.length}</span>
            </div>
            <div className="bg-surface-alt border border-yellow-500/30 rounded-lg px-4 py-2 text-sm">
              <span className="text-yellow-400">Pending: </span>
              <span className="text-yellow-400 font-semibold">{pendingCount}</span>
            </div>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none">
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="bg-surface-alt rounded-xl border border-border p-4 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/2 mb-2" /><div className="h-3 bg-surface-hover rounded w-3/4" /></div>)}</div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-surface-alt rounded-xl border border-border p-12 text-center">
            <div className="text-5xl mb-4 opacity-30">⭐</div>
            <p className="text-text-secondary">Tidak ada ulasan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-surface-alt rounded-xl border border-border p-5 hover:border-gold/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-text-primary text-sm">{review.customerName}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyle(review.status)}`}>
                          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
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
  );
}

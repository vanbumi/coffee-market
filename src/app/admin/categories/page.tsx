'use client';

import { useState, useEffect, useCallback } from 'react';

/** Tipe data kategori */
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string | null;
}

/** Tipe data kupon */
interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string | null;
}

/**
 * Halaman Manajemen Kategori & Kupon (Admin)
 * CRUD kategori produk dan kode kupon diskon
 */
export default function AdminCategoriesPage() {
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'coupons'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- Category Form ---
  const [catForm, setCatForm] = useState({ name: '', description: '', image: '' });
  const [catSubmitting, setCatSubmitting] = useState(false);

  // --- Coupon Form ---
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minPurchase: '0',
    maxUses: '100',
    startDate: '',
    endDate: '',
  });
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Category CRUD ---
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch { /* silent */ }
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) { showNotification('error', 'Nama kategori wajib diisi'); return; }
    setCatSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Kategori berhasil ditambahkan');
        setCatForm({ name: '', description: '', image: '' });
        fetchCategories();
      } else {
        showNotification('error', json.message || 'Gagal menambah kategori');
      }
    } catch { showNotification('error', 'Gagal menambah kategori'); }
    finally { setCatSubmitting(false); }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', 'Kategori dihapus'); fetchCategories(); }
      else showNotification('error', json.message || 'Gagal menghapus');
    } catch { showNotification('error', 'Gagal menghapus kategori'); }
  };

  // --- Coupon CRUD ---
  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/coupons');
      const json = await res.json();
      if (json.success) setCoupons(json.data);
    } catch { /* silent */ }
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) { showNotification('error', 'Kode kupon wajib diisi'); return; }
    if (!couponForm.value || Number(couponForm.value) <= 0) { showNotification('error', 'Nilai kupon wajib diisi'); return; }
    setCouponSubmitting(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...couponForm,
          value: Number(couponForm.value),
          minPurchase: Number(couponForm.minPurchase),
          maxUses: Number(couponForm.maxUses),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Kupon berhasil ditambahkan');
        setCouponForm({ code: '', type: 'percentage', value: '', minPurchase: '0', maxUses: '100', startDate: '', endDate: '' });
        fetchCoupons();
      } else {
        showNotification('error', json.message || 'Gagal menambah kupon');
      }
    } catch { showNotification('error', 'Gagal menambah kupon'); }
    finally { setCouponSubmitting(false); }
  };

  const handleToggleCoupon = async (id: number, currentActive: boolean) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', 'Status kupon diperbarui'); fetchCoupons(); }
      else showNotification('error', json.message || 'Gagal memperbarui');
    } catch { showNotification('error', 'Gagal memperbarui kupon'); }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) { showNotification('success', 'Kupon dihapus'); fetchCoupons(); }
      else showNotification('error', json.message || 'Gagal menghapus');
    } catch { showNotification('error', 'Gagal menghapus kupon'); }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchCategories(), fetchCoupons()]).finally(() => setIsLoading(false));
  }, [fetchCategories, fetchCoupons]);

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString('id-ID'); } catch { return d; }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-text-primary">🏷️ Kategori & Kupon</h1>
          <p className="text-sm text-text-secondary mt-1">Kelola kategori produk dan kode kupon diskon</p>
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

        {/* Sub Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-alt rounded-xl p-1 border border-border">
          <button onClick={() => setActiveSubTab('categories')} className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeSubTab === 'categories' ? 'bg-gold text-black' : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'}`}>
            📂 Kategori ({categories.length})
          </button>
          <button onClick={() => setActiveSubTab('coupons')} className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeSubTab === 'coupons' ? 'bg-gold text-black' : 'text-text-secondary hover:text-text-primary hover:bg-surface-card'}`}>
            🎫 Kupon ({coupons.length})
          </button>
        </div>

        {activeSubTab === 'categories' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Category Form */}
            <div className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Tambah Kategori</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Nama Kategori <span className="text-red-400">*</span></label>
                  <input type="text" value={catForm.name} onChange={(e) => setCatForm(p => ({ ...p, name: e.target.value }))} placeholder="Contoh: Arabica, Robusta, Blend" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Deskripsi</label>
                  <textarea value={catForm.description} onChange={(e) => setCatForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Deskripsi singkat kategori..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">URL Gambar (opsional)</label>
                  <input type="text" value={catForm.image} onChange={(e) => setCatForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <button type="submit" disabled={catSubmitting} className="px-5 py-2.5 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-black rounded-lg font-semibold text-sm transition-all">
                  {catSubmitting ? 'Menyimpan...' : '➕ Tambah Kategori'}
                </button>
              </form>
            </div>
            {/* Category List */}
            <div className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Daftar Kategori</h2>
              {isLoading ? (
                <div className="space-y-3">{[1, 2].map(i => <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/2" /></div>)}</div>
              ) : categories.length === 0 ? (
                <p className="text-text-tertiary text-sm text-center py-8">Belum ada kategori</p>
              ) : (
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-surface-card border border-border rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-text-primary font-medium text-sm">{cat.name}</p>
                        <p className="text-text-tertiary text-xs">{cat.slug}</p>
                      </div>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-text-tertiary hover:text-red-400 transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Coupon Form */}
            <div className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Tambah Kupon</h2>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Kode Kupon <span className="text-red-400">*</span></label>
                  <input type="text" value={couponForm.code} onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="Contoh: KOPI10" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-mono uppercase focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Tipe</label>
                    <select value={couponForm.type} onChange={(e) => setCouponForm(p => ({ ...p, type: e.target.value as 'percentage' | 'fixed' }))} className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none">
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Nilai <span className="text-red-400">*</span></label>
                    <input type="number" value={couponForm.value} onChange={(e) => setCouponForm(p => ({ ...p, value: e.target.value }))} placeholder={couponForm.type === 'percentage' ? '10' : '50000'} min="0" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Min. Pembelian (Rp)</label>
                    <input type="number" value={couponForm.minPurchase} onChange={(e) => setCouponForm(p => ({ ...p, minPurchase: e.target.value }))} min="0" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Maks. Penggunaan</label>
                    <input type="number" value={couponForm.maxUses} onChange={(e) => setCouponForm(p => ({ ...p, maxUses: e.target.value }))} min="1" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Tanggal Mulai</label>
                    <input type="date" value={couponForm.startDate} onChange={(e) => setCouponForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Tanggal Berakhir</label>
                    <input type="date" value={couponForm.endDate} onChange={(e) => setCouponForm(p => ({ ...p, endDate: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                  </div>
                </div>
                <button type="submit" disabled={couponSubmitting} className="px-5 py-2.5 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-black rounded-lg font-semibold text-sm transition-all">
                  {couponSubmitting ? 'Menyimpan...' : '🎫 Tambah Kupon'}
                </button>
              </form>
            </div>
            {/* Coupon List */}
            <div className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Daftar Kupon</h2>
              {isLoading ? (
                <div className="space-y-3">{[1, 2].map(i => <div key={i} className="bg-surface-card rounded-lg p-4 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/2" /></div>)}</div>
              ) : coupons.length === 0 ? (
                <p className="text-text-tertiary text-sm text-center py-8">Belum ada kupon</p>
              ) : (
                <div className="space-y-3">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className={`bg-surface-card border rounded-lg p-4 ${coupon.isActive ? 'border-border' : 'border-red-500/20 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-gold text-sm">{coupon.code}</span>
                        <button onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${coupon.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {coupon.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </div>
                      <p className="text-sm text-text-primary font-semibold">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)} OFF
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                        <span>Min: {formatPrice(coupon.minPurchase)}</span>
                        <span>Used: {coupon.usedCount}/{coupon.maxUses}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-tertiary">
                          {coupon.startDate && formatDate(coupon.startDate)} - {coupon.endDate && formatDate(coupon.endDate)}
                        </span>
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-text-tertiary hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

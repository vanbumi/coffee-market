'use client';

import { useState, useEffect, useCallback } from 'react';

/** Tipe data store settings */
interface StoreSettings {
  id?: number;
  storeName: string;
  npwp: string;
  address: string;
  phone: string;
  email: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroBanner: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  flatShippingCost: string;
  freeShippingMin: string;
  operatingHours: Record<string, { open: string; close: string; closed: boolean }>;
  updatedAt?: string | null;
}

const defaultOperatingHours = {
  senin: { open: '08:00', close: '20:00', closed: false },
  selasa: { open: '08:00', close: '20:00', closed: false },
  rabu: { open: '08:00', close: '20:00', closed: false },
  kamis: { open: '08:00', close: '20:00', closed: false },
  jumat: { open: '08:00', close: '18:00', closed: false },
  sabtu: { open: '09:00', close: '17:00', closed: false },
  minggu: { open: '09:00', close: '15:00', closed: false },
};

const initialSettings: StoreSettings = {
  storeName: 'Sundara Coffee',
  npwp: '',
  address: '',
  phone: '',
  email: '',
  heroTitle: 'Premium Coffee Roastery',
  heroSubtitle: 'Nikmati kopi terbaik dari seluruh nusantara',
  heroCta: 'Jelajahi Katalog',
  heroBanner: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  whatsapp: '',
  flatShippingCost: '15000',
  freeShippingMin: '500000',
  operatingHours: defaultOperatingHours,
};

/**
 * Halaman Pengaturan Toko (Admin)
 * Konfigurasi informasi bisnis, jam operasional, ongkir, banner, dan social media
 */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          ...initialSettings,
          ...json.data,
          operatingHours: json.data.operatingHours ? 
            (typeof json.data.operatingHours === 'string' ? JSON.parse(json.data.operatingHours) : json.data.operatingHours) 
            : defaultOperatingHours,
        });
      }
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showNotification('success', 'Pengaturan berhasil disimpan!');
      } else {
        showNotification('error', json.message || 'Gagal menyimpan pengaturan');
      }
    } catch { showNotification('error', 'Gagal menyimpan pengaturan'); }
    finally { setIsSaving(false); }
  };

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours[day], [field]: value },
      },
    }));
  };

  const dayLabels: Record<string, string> = {
    senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis',
    jumat: 'Jumat', sabtu: 'Sabtu', minggu: 'Minggu',
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-alt border-b border-border shadow-sm shadow-black/20 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">⚙️ Pengaturan Toko</h1>
              <p className="text-sm text-text-secondary mt-1">Konfigurasi informasi bisnis Sundara Coffee</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-black rounded-lg font-semibold text-sm transition-all shadow-sm shadow-gold/20 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-4xl">
        {notification && (
          <div className={`px-4 py-3 rounded-xl border flex items-center justify-between ${notification.type === 'success' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="bg-surface-alt rounded-xl border border-border p-6 animate-pulse"><div className="h-4 bg-surface-hover rounded w-1/3 mb-3" /><div className="h-10 bg-surface-hover rounded" /></div>)}</div>
        ) : (
          <>
            {/* Informasi Bisnis */}
            <section className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">🏢 Informasi Bisnis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Nama Perusahaan</label>
                  <input type="text" value={settings.storeName} onChange={(e) => setSettings(p => ({ ...p, storeName: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">NPWP</label>
                  <input type="text" value={settings.npwp} onChange={(e) => setSettings(p => ({ ...p, npwp: e.target.value }))} placeholder="XX.XXX.XXX.X-XXX.XXX" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-secondary mb-1">Alamat Lengkap</label>
                  <textarea value={settings.address} onChange={(e) => setSettings(p => ({ ...p, address: e.target.value }))} rows={2} placeholder="Jl. ..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Telepon</label>
                  <input type="text" value={settings.phone} onChange={(e) => setSettings(p => ({ ...p, phone: e.target.value }))} placeholder="+62..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings(p => ({ ...p, email: e.target.value }))} placeholder="info@sundaracoffee.com" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
              </div>
            </section>

            {/* Hero Banner */}
            <section className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">🖼️ Hero Banner (Homepage)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Judul Hero</label>
                  <input type="text" value={settings.heroTitle} onChange={(e) => setSettings(p => ({ ...p, heroTitle: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Teks CTA</label>
                  <input type="text" value={settings.heroCta} onChange={(e) => setSettings(p => ({ ...p, heroCta: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-secondary mb-1">Subtitle Hero</label>
                  <input type="text" value={settings.heroSubtitle} onChange={(e) => setSettings(p => ({ ...p, heroSubtitle: e.target.value }))} className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-secondary mb-1">URL Gambar Banner</label>
                  <input type="text" value={settings.heroBanner} onChange={(e) => setSettings(p => ({ ...p, heroBanner: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                  {settings.heroBanner && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border w-full h-32 bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.heroBanner} alt="Preview banner" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">🚚 Biaya Pengiriman</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Ongkir Flat (Rp)</label>
                  <input type="number" value={settings.flatShippingCost} onChange={(e) => setSettings(p => ({ ...p, flatShippingCost: e.target.value }))} min="0" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Gratis Ongkir Min. Pembelian (Rp)</label>
                  <input type="number" value={settings.freeShippingMin} onChange={(e) => setSettings(p => ({ ...p, freeShippingMin: e.target.value }))} min="0" className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
              </div>
            </section>

            {/* Operating Hours */}
            <section className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">🕐 Jam Operasional</h2>
              <div className="space-y-2">
                {Object.entries(settings.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3 bg-surface-card rounded-lg p-3 border border-border">
                    <span className="w-20 text-sm font-medium text-text-primary capitalize">{dayLabels[day] || day}</span>
                    <label className="flex items-center gap-2 text-xs text-text-secondary">
                      <input
                        type="checkbox"
                        checked={hours.closed}
                        onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                        className="rounded border-border bg-surface text-gold focus:ring-gold/20"
                      />
                      Tutup
                    </label>
                    {!hours.closed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <input type="time" value={hours.open} onChange={(e) => handleHoursChange(day, 'open', e.target.value)} className="px-2 py-1 bg-surface border border-border rounded text-xs text-text-primary focus:ring-2 focus:ring-gold/20 outline-none" />
                        <span className="text-text-tertiary text-xs">s/d</span>
                        <input type="time" value={hours.close} onChange={(e) => handleHoursChange(day, 'close', e.target.value)} className="px-2 py-1 bg-surface border border-border rounded text-xs text-text-primary focus:ring-2 focus:ring-gold/20 outline-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media */}
            <section className="bg-surface-alt rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">📱 Social Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Instagram URL</label>
                  <input type="text" value={settings.instagram} onChange={(e) => setSettings(p => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Facebook URL</label>
                  <input type="text" value={settings.facebook} onChange={(e) => setSettings(p => ({ ...p, facebook: e.target.value }))} placeholder="https://facebook.com/..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">TikTok URL</label>
                  <input type="text" value={settings.tiktok} onChange={(e) => setSettings(p => ({ ...p, tiktok: e.target.value }))} placeholder="https://tiktok.com/@..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">WhatsApp (nomor)</label>
                  <input type="text" value={settings.whatsapp} onChange={(e) => setSettings(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+62812..." className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none" />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

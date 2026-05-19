'use client';

import { useState, useEffect } from 'react';

export interface StoreSettingsData {
  storeName?: string;
  slogan?: string;
  npwp?: string;
  address?: string;
  phone?: string;
  email?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  heroBanner?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
  flatShippingCost?: string;
  freeShippingMin?: string;
  operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
}

const defaultSettings: StoreSettingsData = {
  storeName: 'Revaktor',
  slogan: 'Exotic Aesthetic Coffee for the World',
  heroTitle: 'Premium Coffee Roastery',
  heroSubtitle: 'Nikmati kopi terbaik dari seluruh nusantara',
  heroCta: 'Jelajahi Katalog',
  address: 'Jl. Kopi Nikmat No. 123, Bandung',
  phone: '+62 812-3456-7890',
  email: 'hello@revaktor.com',
  flatShippingCost: '15000',
  freeShippingMin: '500000',
};

let cachedSettings: StoreSettingsData | null = null;
let fetchPromise: Promise<StoreSettingsData> | null = null;

/**
 * Hook untuk mengambil pengaturan toko dari API /api/settings.
 * Menggunakan in-memory cache global agar fetch hanya terjadi sekali
 * di seluruh aplikasi.
 */
export function useStoreSettings(): {
  settings: StoreSettingsData;
  loading: boolean;
} {
  const [settings, setSettings] = useState<StoreSettingsData>(
    cachedSettings ?? defaultSettings,
  );
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load(): Promise<StoreSettingsData> {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const parsed: StoreSettingsData = { ...defaultSettings, ...json.data };
          // Parse operatingHours if stored as string
          if (parsed.operatingHours && typeof parsed.operatingHours === 'string') {
            try {
              parsed.operatingHours = JSON.parse(parsed.operatingHours);
            } catch { /* keep as-is */ }
          }
          return parsed;
        }
        return defaultSettings;
      } catch {
        return defaultSettings;
      }
    }

    if (!fetchPromise) {
      fetchPromise = load();
    }

    fetchPromise.then((data) => {
      if (!cancelled) {
        cachedSettings = data;
        setSettings(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}

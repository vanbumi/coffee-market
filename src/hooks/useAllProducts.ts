'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';

/**
 * Hook untuk mendapatkan semua produk (statis + dinamis dari admin)
 * 
 * Mengambil data dari API /api/products yang menggabungkan
 * produk statis dari products.ts dengan produk dinamis dari products.json
 */
export function useAllProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const json = await res.json();

        if (mounted && json.success) {
          setAllProducts(json.data);
        }
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
        // Fallback ke static products jika API gagal
        if (mounted) {
          setError('Gagal memuat produk tambahan');
          setAllProducts(staticProducts);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return { allProducts, loading, error };
}

/**
 * Hook untuk mendapatkan produk berdasarkan ID dari semua sumber
 */
export function useProductById(id: string | undefined) {
  const { allProducts } = useAllProducts();
  return allProducts.find((p) => p.id === id);
}

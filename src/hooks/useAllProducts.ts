'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';

/**
 * Mengubah nama produk menjadi slug (lowercase, spasi → strip, hapus karakter khusus)
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Hook untuk mendapatkan semua produk (statis + dinamis dari admin)
 * 
 * Selalu menggunakan slug-based ID untuk konsistensi URL.
 * Produk statis default sudah punya slug ID; produk dari DB
 * akan diberi slug ID yang di-generate dari nama produknya.
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
          const dbProducts: Product[] = json.data;
          const staticNames = new Set(staticProducts.map((p) => p.name.toLowerCase()));

          // Generate slug IDs for DB products (matching static slug pattern)
          const dbWithSlugs: Product[] = dbProducts.map((p) => ({
            ...p,
            id: slugify(p.name),
          }));

          // Merge: keep all static products. Add DB products that don't already
          // exist in the static list (admin-added products).
          const newFromDB = dbWithSlugs.filter(
            (p) => !staticNames.has(p.name.toLowerCase()),
          );

          setAllProducts([...staticProducts, ...newFromDB]);
        }
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
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
 * Hook untuk mendapatkan produk berdasarkan ID dari semua sumber.
 * Mencocokkan slug ID, lalu fallback ke numeric DB ID.
 */
export function useProductById(id: string | undefined) {
  const { allProducts } = useAllProducts();
  if (!id) return undefined;

  // Try direct match first (slug or numeric)
  const direct = allProducts.find((p) => p.id === id);
  if (direct) return direct;

  // Try matching by slugified name
  return allProducts.find((p) => slugify(p.name) === id);
}

'use client';

import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-card rounded-xl border border-border overflow-hidden animate-pulse"
          >
            <div className="h-48 sm:h-56 bg-surface-hover" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-surface-hover rounded w-3/4" />
              <div className="h-4 bg-surface-hover rounded w-1/2" />
              <div className="h-3 bg-surface-hover rounded w-full" />
              <div className="h-6 bg-surface-hover rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Produk Tidak Ditemukan
        </h3>
        <p className="text-text-secondary">
          Coba ubah filter atau kata kunci pencarian Anda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

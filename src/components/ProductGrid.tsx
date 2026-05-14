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
            className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden animate-pulse"
          >
            <div className="h-48 sm:h-56 bg-[#2A2A2A]" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-[#2A2A2A] rounded w-3/4" />
              <div className="h-4 bg-[#2A2A2A] rounded w-1/2" />
              <div className="h-3 bg-[#2A2A2A] rounded w-full" />
              <div className="h-6 bg-[#2A2A2A] rounded w-1/3" />
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
        <h3 className="text-xl font-semibold text-white mb-2">
          Produk Tidak Ditemukan
        </h3>
        <p className="text-[#A3A3A3]">
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

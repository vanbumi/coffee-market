'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { formatRupiah } from '@/utils/helpers';

interface ProductManagementProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
}

/**
 * Komponen manajemen produk untuk admin
 * Menampilkan daftar produk yang ditambahkan via admin dashboard
 * dengan opsi untuk menghapus produk
 */
export default function ProductManagement({ products, onDeleteProduct }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-[#555555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="mt-2 text-sm text-[#A3A3A3]">Belum ada produk dari admin</p>
        <p className="text-xs text-[#555555]">Gunakan form di atas untuk menambah produk</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#555555]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari produk admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none text-sm text-white placeholder-[#555555]"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 flex items-center gap-4 hover:border-gold/20 hover:shadow-sm hover:shadow-gold/5 transition-all group"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0A0A0A] flex-shrink-0 border border-[#2A2A2A]">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555555]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm truncate group-hover:text-gold transition-colors">{product.name}</h4>
              <p className="text-xs text-[#A3A3A3]">{product.origin} • {product.type}</p>
              <p className="text-sm font-semibold text-gold mt-1">
                {formatRupiah(product.price)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              {deleteConfirm === product.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1.5 bg-[#2A2A2A] text-[#A3A3A3] text-xs rounded-lg hover:bg-[#333333] transition-colors"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 text-[#555555] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Hapus produk"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 text-xs text-[#555555] text-center">
        Menampilkan {filteredProducts.length} dari {products.length} produk admin
      </div>
    </div>
  );
}

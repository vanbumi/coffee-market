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
        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">Belum ada produk dari admin</p>
        <p className="text-xs text-gray-400">Gunakan form di atas untuk menambah produk</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.origin} • {product.type}</p>
              <p className="text-sm font-semibold text-primary-500 mt-1">
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
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      <div className="mt-4 text-xs text-gray-400 text-center">
        Menampilkan {filteredProducts.length} dari {products.length} produk admin
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { formatRupiah, truncateText } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleClick = () => {
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Badge Type */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.type === 'Arabica'
                ? 'bg-primary-500 text-white'
                : product.type === 'Robusta'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-700 text-white'
            }`}
          >
            {product.type}
          </span>
        </div>

        {/* Badge Featured */}
        {product.featured && (
          <div className="absolute top-3 left-20">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
              Featured
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center shadow-sm">
          <span className="text-yellow-500 mr-1">★</span>
          {product.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Nama Produk */}
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Asal & Region */}
        <p className="text-gray-500 text-sm mb-2">
          {product.origin}, {product.region}
        </p>

        {/* Deskripsi Singkat */}
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {truncateText(product.description, 60)}
        </p>

        {/* Tasting Notes - Tinggi Tetap */}
        <div className="h-8 mb-3 overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {product.tastingNotes.slice(0, 2).map((note) => (
              <span
                key={note}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize"
              >
                {note}
              </span>
            ))}
            {product.tastingNotes.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{product.tastingNotes.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Harga & Tombol - DIPERBAIKI */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          {/* Harga + /kg dalam 1 BARIS */}
          <div className="text-primary-500 font-bold text-lg mb-3">
            {formatRupiah(product.price)}
            <span className="text-gray-400 text-xs font-normal ml-1">/kg</span>
          </div>
          
          {/* Tombol Lihat Detail - FULL WIDTH, DI BAWAH SENDIRI */}
          <div className="block w-full text-center bg-primary-500 hover:bg-primary-600 active:scale-95 text-white py-2 rounded-lg transition-all text-sm font-medium">
            Lihat Detail →
          </div>
        </div>
      </div>
    </div>
  );
}
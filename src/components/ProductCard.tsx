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
      className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-gold/30 cursor-pointer flex flex-col h-full transition-all duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
    >
      {/* Gold accent top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-[#111111]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge Type */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              product.type === 'Arabica'
                ? 'bg-gold/20 text-gold border-gold/30'
                : product.type === 'Robusta'
                ? 'bg-[#A3A3A3]/20 text-[#A3A3A3] border-[#A3A3A3]/30'
                : 'bg-gold/30 text-gold border-gold/40'
            }`}
          >
            {product.type}
          </span>
        </div>

        {/* Badge Featured */}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gold text-black">
              ★ Featured
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center border border-[#2A2A2A]">
          <span className="text-gold mr-1">★</span>
          {product.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Nama Produk */}
        <h3 className="font-semibold text-white text-base mb-1 line-clamp-1 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>

        {/* Asal & Region */}
        <p className="text-[#A3A3A3] text-sm mb-2">
          {product.origin}, {product.region}
        </p>

        {/* Deskripsi Singkat */}
        <p className="text-[#A3A3A3]/70 text-xs mb-3 line-clamp-2">
          {truncateText(product.description, 60)}
        </p>

        {/* Tasting Notes */}
        <div className="h-8 mb-3 overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {product.tastingNotes.slice(0, 2).map((note) => (
              <span
                key={note}
                className="px-2 py-0.5 bg-[#2A2A2A] text-[#A3A3A3] rounded-full text-xs capitalize"
              >
                {note}
              </span>
            ))}
            {product.tastingNotes.length > 2 && (
              <span className="px-2 py-0.5 bg-[#2A2A2A] text-[#A3A3A3] rounded-full text-xs">
                +{product.tastingNotes.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Harga & Tombol */}
        <div className="mt-auto pt-3 border-t border-[#2A2A2A]">
          <div className="text-gold font-bold text-lg mb-3">
            {formatRupiah(product.price)}
            <span className="text-[#A3A3A3] text-xs font-normal ml-1">/kg</span>
          </div>
          
          {/* Tombol Lihat Detail */}
          <div className="block w-full text-center border border-gold/50 text-gold hover:bg-gold hover:text-black py-2.5 rounded-lg transition-all duration-300 text-sm font-medium hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            Lihat Detail →
          </div>
        </div>
      </div>
    </div>
  );
}

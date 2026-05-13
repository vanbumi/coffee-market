'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatRupiah, truncateText } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.type === 'Arabica'
                ? 'bg-[#2E5A1C] text-white'
                : product.type === 'Robusta'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {product.type}
          </span>
          {product.featured && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
              Featured
            </span>
          )}
        </div>
        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center shadow">
          <span className="text-yellow-500 mr-1">★</span>
          {product.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#6F4E37] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          {product.origin}, {product.region}
        </p>
        <p className="text-gray-600 text-xs mb-3">
          {truncateText(product.description, 80)}
        </p>

        {/* Tasting Notes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tastingNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 bg-[#F5E6D3] text-[#6F4E37] rounded-full text-xs capitalize"
            >
              {note}
            </span>
          ))}
          {product.tastingNotes.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{product.tastingNotes.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-[#6F4E37] font-bold text-lg">
            {formatRupiah(product.price)}
            <span className="text-gray-400 text-xs font-normal"> /kg</span>
          </span>
          <span className="text-[#2E5A1C] text-sm font-medium group-hover:underline">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}

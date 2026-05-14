'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import { formatRupiah } from '@/utils/helpers';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
      {/* Image */}
      <Link
        href={`/product/${item.product.id}`}
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.product.id}`}
          className="font-semibold text-gray-900 hover:text-primary-500 transition-colors truncate block"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-gray-500">{item.product.origin}</p>
        <p className="text-primary-500 font-semibold mt-1">
          {formatRupiah(item.product.price)}
          <span className="text-gray-400 text-xs font-normal"> /kg</span>
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          -
        </button>
        <span className="px-3 py-1.5 text-gray-900 font-medium min-w-[40px] text-center text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= 10}
          className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="text-sm text-gray-500">Subtotal</p>
        <p className="font-bold text-gray-900">{formatRupiah(subtotal)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        title="Hapus item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

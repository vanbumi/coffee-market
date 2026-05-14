'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';
import { formatRupiah } from '@/utils/helpers';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('coffee-last-order');
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-8xl mb-6">📋</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Tidak Ada Pesanan
        </h1>
        <p className="text-gray-500 mb-8">
          Belum ada pesanan yang dibuat. Yuk, mulai belanja sekarang!
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm"
        >
          Lihat Katalog
        </Link>
      </div>
    );
  }

  const handleTrackOrder = () => {
    alert('Fitur lacak pesanan akan segera tersedia! Saat ini pesanan Anda sedang diproses.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="text-8xl mb-4">🎉</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-lg text-gray-500">
          Terima kasih telah berbelanja di Saudara Coffee
        </p>
      </div>

      {/* Order ID */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Nomor Pesanan</p>
        <p className="text-2xl font-bold text-primary-500 font-mono">
          {order.id}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Simpan nomor pesanan ini untuk melacak status pengiriman
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shipping Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Alamat Pengiriman
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </p>
            <p>
              {order.shippingAddress.province} - {order.shippingAddress.postalCode}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Metode Pengiriman</p>
            <p className="font-semibold text-gray-900">
              {order.shippingMethod.name} ({order.shippingMethod.estimatedDays})
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Pembayaran
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-500">Metode Pembayaran</p>
            <p className="font-semibold text-gray-900">{order.paymentMethod.label}</p>
            <p className="text-gray-500 mt-3">Status</p>
            <span className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Menunggu Pembayaran
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} kg x {formatRupiah(item.product.price)}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatRupiah(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-900">{formatRupiah(order.summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Biaya Pengiriman</span>
            <span className="font-medium text-gray-900">{formatRupiah(order.summary.shippingCost)}</span>
          </div>
          {order.summary.discount > 0 && (
            <div className="flex justify-between text-sm text-primary-600">
              <span>Diskon</span>
              <span>-{formatRupiah(order.summary.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-primary-500">{formatRupiah(order.summary.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Lihat Katalog
        </Link>
        <button
          onClick={handleTrackOrder}
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Lacak Pesanan
        </button>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-12 p-8 bg-primary-50 rounded-2xl border border-primary-100">
        <p className="text-lg text-primary-600 font-semibold">
          ☕ Terima kasih telah berbelanja di Saudara Coffee!
        </p>
        <p className="text-primary-500/80 mt-2">
          Kami akan segera memproses pesanan Anda. Nikmati kopi Nusantara terbaik!
        </p>
      </div>
    </div>
  );
}

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
          <div className="h-16 w-16 bg-surface-hover rounded-full mx-auto" />
          <div className="h-8 bg-surface-hover rounded w-64 mx-auto" />
          <div className="h-4 bg-surface-hover rounded w-96 mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-8xl mb-6 opacity-50">📋</div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Tidak Ada Pesanan
        </h1>
        <p className="text-text-secondary mb-8">
          Belum ada pesanan yang dibuat. Yuk, mulai belanja sekarang!
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all duration-300 font-semibold shadow-lg shadow-gold/10"
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
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-lg text-text-secondary">
          Terima kasih telah berbelanja di Sundara Coffee
        </p>
      </div>

      {/* Order ID */}
      <div className="bg-surface-card rounded-xl border border-border p-6 mb-6 text-center">
        <p className="text-sm text-text-secondary mb-1">Nomor Pesanan</p>
        <p className="text-2xl font-bold text-gold font-mono">
          {order.id}
        </p>
        <p className="text-xs text-text-secondary mt-2">
          Simpan nomor pesanan ini untuk melacak status pengiriman
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Shipping Info */}
        <div className="bg-surface-card rounded-xl border border-border p-6">
          <h3 className="font-bold text-gold mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Alamat Pengiriman
          </h3>
          <div className="space-y-1 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </p>
            <p>
              {order.shippingAddress.province} - {order.shippingAddress.postalCode}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-text-secondary">Metode Pengiriman</p>
            <p className="font-semibold text-text-primary">
              {order.shippingMethod.name} ({order.shippingMethod.estimatedDays})
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-surface-card rounded-xl border border-border p-6">
          <h3 className="font-bold text-gold mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Pembayaran
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-text-secondary">Metode Pembayaran</p>
            <p className="font-semibold text-text-primary">{order.paymentMethod.label}</p>
            <p className="text-text-secondary mt-3">Status</p>
            <span className="inline-flex px-3 py-1 bg-gold/20 text-gold border border-gold/30 rounded-full text-sm font-medium">
              Menunggu Pembayaran
            </span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-surface-card rounded-xl border border-border p-6 mb-8">
        <h3 className="font-bold text-gold mb-4">Ringkasan Pesanan</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-text-primary">{item.product.name}</p>
                <p className="text-sm text-text-secondary">
                  {item.quantity} kg x {formatRupiah(item.product.price)}
                </p>
              </div>
              <p className="font-semibold text-text-primary">
                {formatRupiah(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-medium text-text-primary">{formatRupiah(order.summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Biaya Pengiriman</span>
            <span className="font-medium text-text-primary">{formatRupiah(order.summary.shippingCost)}</span>
          </div>
          {order.summary.discount > 0 && (
            <div className="flex justify-between text-sm text-gold">
              <span>Diskon</span>
              <span>-{formatRupiah(order.summary.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
            <span className="text-text-primary">Total</span>
            <span className="text-gold">{formatRupiah(order.summary.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all duration-300 font-semibold shadow-lg shadow-gold/10"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Lihat Katalog
        </Link>
        <button
          onClick={handleTrackOrder}
          className="inline-flex items-center justify-center px-8 py-4 border border-gold/40 text-gold rounded-xl hover:bg-gold/10 transition-all duration-300 font-semibold"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Lacak Pesanan
        </button>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-12 p-8 bg-gold/5 rounded-2xl border border-gold/20">
        <p className="text-lg text-gold font-semibold">
          ☕ Terima kasih telah berbelanja di Sundara Coffee!
        </p>
        <p className="text-text-secondary mt-2">
          Kami akan segera memproses pesanan Anda. Nikmati kopi Nusantara terbaik!
        </p>
      </div>
    </div>
  );
}

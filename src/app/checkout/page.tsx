'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import Toast from '@/components/Toast';
import { ShippingAddress, ShippingMethod, PaymentMethod, Order } from '@/types/order';
import { generateOrderId } from '@/utils/helpers';
import { useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, voucherCode, clearCart } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Tidak Ada Item untuk Checkout
          </h1>
          <p className="text-gray-500 mb-8">
            Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold shadow-sm"
          >
            Lihat Katalog
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: {
    shippingAddress: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
  }) => {
    // Calculate totals
    const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = Math.max(
      totalWeight * data.shippingMethod.pricePerKg,
      data.shippingMethod.minPrice
    );

    let discount = 0;
    let finalShippingCost = shippingCost;

    if (voucherCode === 'COFFEE10') {
      discount = subtotal * 0.1;
    } else if (voucherCode === 'GRATISONGKIR' && subtotal >= 500000) {
      finalShippingCost = 0;
    }

    const total = subtotal - discount + finalShippingCost;

    const order: Order = {
      id: generateOrderId(),
      items,
      shippingAddress: data.shippingAddress,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      summary: {
        subtotal,
        shippingCost: finalShippingCost,
        discount,
        total,
        voucherCode,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage
    try {
      localStorage.setItem('coffee-last-order', JSON.stringify(order));
    } catch {
      // ignore
    }

    // Clear cart
    clearCart();

    // Show success message
    setToastMessage('Pesanan berhasil dibuat! Detail pesanan akan dikirim ke email/WhatsApp.');
    setToastVisible(true);

    // Redirect to success page
    setTimeout(() => {
      router.push('/order/success');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toast
        message={toastMessage}
        type="success"
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500">
          Lengkapi informasi pengiriman dan pembayaran Anda
        </p>
      </div>

      <CheckoutForm
        items={items}
        subtotal={subtotal}
        voucherCode={voucherCode}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

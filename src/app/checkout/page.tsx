'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import Toast from '@/components/Toast';
import { ShippingAddress, ShippingMethod, PaymentMethod } from '@/types/order';
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
          <div className="text-8xl mb-6 opacity-50">🛒</div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            Tidak Ada Item untuk Checkout
          </h1>
          <p className="text-text-secondary mb-8">
            Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold-light transition-all duration-300 font-semibold shadow-lg shadow-gold/10"
          >
            Lihat Katalog
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: {
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

    // Save order to database via API
    try {
      const orderPayload = {
        order: {
          customerName: data.shippingAddress.fullName,
          customerPhone: data.shippingAddress.phone,
          customerAddress: `${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postalCode}`,
          totalAmount: total,
          shippingCost: finalShippingCost,
          discount: discount,
          paymentMethod: data.paymentMethod.name,
        },
        items: items.map((item) => ({
          productId: parseInt(item.id) || 0,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Gagal membuat pesanan');
      }

      // Save order summary to localStorage for success page
      const orderSummary = {
        orderId: json.orderId,
        orderNumber: json.orderNumber,
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
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('coffee-last-order', JSON.stringify(orderSummary));
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
    } catch (error) {
      console.error('Error creating order:', error);
      setToastMessage('Gagal membuat pesanan. Silakan coba lagi.');
      setToastVisible(true);
    }
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Checkout</h1>
        <p className="text-text-secondary">
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

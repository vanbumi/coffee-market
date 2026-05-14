'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItemComponent from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import Toast from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    voucherCode,
    updateQuantity,
    removeItem,
    applyVoucher,
    removeVoucher,
  } = useCart();
  const [selectedShipping, setSelectedShipping] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) {
      setVoucherError('Masukkan kode voucher');
      return;
    }
    const success = applyVoucher(voucherInput.trim());
    if (success) {
      setVoucherError(null);
      setVoucherInput('');
      setToastMessage('Voucher berhasil diterapkan!');
      setToastType('success');
      setToastVisible(true);
    } else {
      setVoucherError('Kode voucher tidak valid');
      setToastMessage('Kode voucher tidak valid');
      setToastType('error');
      setToastVisible(true);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Keranjang Belanja Kosong
          </h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Anda belum menambahkan produk apapun ke keranjang. Yuk, jelajahi katalog kami!
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-semibold text-lg shadow-sm"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Keranjang Belanja
        </h1>
        <p className="text-gray-500">
          {items.length} item ({items.reduce((sum, i) => sum + i.quantity, 0)} kg)
        </p>
      </div>

      {/* Mobile: Items on top, Summary below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Summary */}
        <div>
          <CartSummary
            items={items}
            voucherCode={voucherCode}
            subtotal={subtotal}
            selectedShipping={selectedShipping}
            onShippingChange={setSelectedShipping}
            onApplyVoucher={handleApplyVoucher}
            onRemoveVoucher={removeVoucher}
            voucherInput={voucherInput}
            onVoucherInputChange={setVoucherInput}
            voucherError={voucherError}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

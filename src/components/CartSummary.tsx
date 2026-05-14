'use client';

import { CartItem } from '@/types/cart';
import { formatRupiah, calculateShippingCost, calculateTotalWeight, getDiscountPercentage, isFreeShipping } from '@/utils/helpers';
import { shippingMethods } from '@/utils/shipping';

interface CartSummaryProps {
  items: CartItem[];
  voucherCode: string | null;
  subtotal: number;
  selectedShipping: string;
  onShippingChange: (methodId: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  voucherInput: string;
  onVoucherInputChange: (value: string) => void;
  voucherError: string | null;
  onCheckout: () => void;
}

export default function CartSummary({
  items,
  voucherCode,
  subtotal,
  selectedShipping,
  onShippingChange,
  onApplyVoucher,
  onRemoveVoucher,
  voucherInput,
  onVoucherInputChange,
  voucherError,
  onCheckout,
}: CartSummaryProps) {
  const totalWeight = calculateTotalWeight(items);
  const shippingMethod = shippingMethods.find((m) => m.id === selectedShipping);
  const shippingCost = shippingMethod
    ? calculateShippingCost(totalWeight, shippingMethod.pricePerKg, shippingMethod.minPrice)
    : 0;

  const discountPercent = voucherCode ? getDiscountPercentage(voucherCode) : 0;
  const discount = (subtotal * discountPercent) / 100;
  const freeShip = voucherCode ? isFreeShipping(voucherCode, subtotal) : false;
  const finalShippingCost = freeShip ? 0 : shippingCost;
  const total = subtotal - discount + finalShippingCost;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900">Ringkasan Belanja</h2>

      {/* Shipping Method */}
      {items.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Metode Pengiriman
          </label>
          <select
            value={selectedShipping}
            onChange={(e) => onShippingChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
          >
            <option value="">Pilih pengiriman</option>
            {shippingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name} ({method.estimatedDays}) - {formatRupiah(method.pricePerKg)}/kg
              </option>
            ))}
          </select>
          {shippingMethod && (
            <p className="text-xs text-gray-500 mt-1">
              Berat total: {totalWeight} kg | Estimasi: {shippingMethod.estimatedDays}
            </p>
          )}
        </div>
      )}

      {/* Voucher */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Voucher / Kode Promo
        </label>
        {voucherCode ? (
          <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-primary-700">{voucherCode}</span>
            <button
              onClick={onRemoveVoucher}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kode"
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              onClick={onApplyVoucher}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Pakai
            </button>
          </div>
        )}
        {voucherError && (
          <p className="text-xs text-red-500 mt-1">{voucherError}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Coba: COFFEE10 (diskon 10%) | GRATISONGKIR (min. Rp500.000)
        </p>
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Berat Total</span>
          <span className="font-medium text-gray-900">{totalWeight} kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Biaya Pengiriman</span>
          <span className="font-medium text-gray-900">
            {items.length > 0 ? formatRupiah(finalShippingCost) : '-'}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-primary-600">
            <span>Diskon ({discountPercent}%)</span>
            <span className="font-medium">-{formatRupiah(discount)}</span>
          </div>
        )}
        {freeShip && (
          <div className="flex justify-between text-sm text-primary-600">
            <span>Gratis Ongkir</span>
            <span className="font-medium">-{formatRupiah(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3">
          <span className="text-gray-900">Total</span>
          <span className="text-primary-500">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full font-semibold transition-colors shadow-sm hover:shadow-md"
      >
        Lanjut ke Checkout
      </button>
    </div>
  );
}

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
    <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 space-y-6 sticky top-24">
      <h2 className="text-lg font-bold text-gold tracking-wide">Ringkasan Belanja</h2>

      {/* Shipping Method */}
      {items.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Metode Pengiriman
          </label>
          <select
            value={selectedShipping}
            onChange={(e) => onShippingChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
          >
            <option value="">Pilih pengiriman</option>
            {shippingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name} ({method.estimatedDays}) - {formatRupiah(method.pricePerKg)}/kg
              </option>
            ))}
          </select>
          {shippingMethod && (
            <p className="text-xs text-[#A3A3A3] mt-1">
              Berat total: {totalWeight} kg | Estimasi: {shippingMethod.estimatedDays}
            </p>
          )}
        </div>
      )}

      {/* Voucher */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Voucher / Kode Promo
        </label>
        {voucherCode ? (
          <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-gold">{voucherCode}</span>
            <button
              onClick={onRemoveVoucher}
              className="text-red-400 hover:text-red-300 text-sm"
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
              className="flex-1 px-3 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-[#A3A3A3] text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
            />
            <button
              onClick={onApplyVoucher}
              className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-light transition-all duration-300 text-sm font-medium"
            >
              Pakai
            </button>
          </div>
        )}
        {voucherError && (
          <p className="text-xs text-red-400 mt-1">{voucherError}</p>
        )}
        <p className="text-xs text-[#A3A3A3] mt-1">
          Coba: COFFEE10 (diskon 10%) | GRATISONGKIR (min. Rp500.000)
        </p>
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Subtotal</span>
          <span className="font-medium text-white">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Berat Total</span>
          <span className="font-medium text-white">{totalWeight} kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#A3A3A3]">Biaya Pengiriman</span>
          <span className="font-medium text-white">
            {items.length > 0 ? formatRupiah(finalShippingCost) : '-'}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-gold">
            <span>Diskon ({discountPercent}%)</span>
            <span className="font-medium">-{formatRupiah(discount)}</span>
          </div>
        )}
        {freeShip && (
          <div className="flex justify-between text-sm text-gold">
            <span>Gratis Ongkir</span>
            <span className="font-medium">-{formatRupiah(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-[#2A2A2A] pt-3">
          <span className="text-white">Total</span>
          <span className="text-gold">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full py-3.5 bg-gold hover:bg-gold-light disabled:bg-[#2A2A2A] disabled:text-[#A3A3A3] disabled:cursor-not-allowed text-black rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20"
      >
        Lanjut ke Checkout
      </button>
    </div>
  );
}

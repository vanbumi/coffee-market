'use client';

import { useState } from 'react';
import { provinces, getCitiesByProvince, shippingMethods } from '@/utils/shipping';
import { ShippingAddress, ShippingMethod, PaymentMethod } from '@/types/order';
import { CartItem } from '@/types/cart';
import { formatRupiah, calculateShippingCost, calculateTotalWeight, getDiscountPercentage, isFreeShipping } from '@/utils/helpers';

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  voucherCode: string | null;
  onSubmit: (data: {
    shippingAddress: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
  }) => void;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'bca', name: 'BCA', type: 'bank_transfer', label: 'Bank Transfer BCA' },
  { id: 'mandiri', name: 'Mandiri', type: 'bank_transfer', label: 'Bank Transfer Mandiri' },
  { id: 'bni', name: 'BNI', type: 'bank_transfer', label: 'Bank Transfer BNI' },
  { id: 'qris', name: 'QRIS', type: 'qris', label: 'QRIS' },
  { id: 'cod', name: 'COD', type: 'cod', label: 'COD (Bayar di Tempat)' },
];

export default function CheckoutForm({
  items,
  subtotal,
  voucherCode,
  onSubmit,
}: CheckoutFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = province ? getCitiesByProvince(province) : [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap harus diisi';
    if (!phone.trim()) newErrors.phone = 'Nomor HP harus diisi';
    if (!address.trim()) newErrors.address = 'Alamat harus diisi';
    if (!province) newErrors.province = 'Provinsi harus dipilih';
    if (!city) newErrors.city = 'Kota harus dipilih';
    if (!district.trim()) newErrors.district = 'Kecamatan harus diisi';
    if (!postalCode.trim()) newErrors.postalCode = 'Kode pos harus diisi';
    if (!shippingMethod) newErrors.shippingMethod = 'Metode pengiriman harus dipilih';
    if (!paymentMethod) newErrors.paymentMethod = 'Metode pembayaran harus dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod)!;
    const selectedPayment = paymentMethods.find((m) => m.id === paymentMethod)!;

    onSubmit({
      shippingAddress: {
        fullName,
        phone,
        address,
        province,
        city,
        district,
        postalCode,
      },
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
    });
  };

  const totalWeight = calculateTotalWeight(items);
  const selectedShippingMethod = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost = selectedShippingMethod
    ? calculateShippingCost(totalWeight, selectedShippingMethod.pricePerKg, selectedShippingMethod.minPrice)
    : 0;
  const discountPercent = voucherCode ? getDiscountPercentage(voucherCode) : 0;
  const discount = (subtotal * discountPercent) / 100;
  const freeShip = voucherCode ? isFreeShipping(voucherCode, subtotal) : false;
  const finalShippingCost = freeShip ? 0 : shippingCost;
  const total = subtotal - discount + finalShippingCost;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Informasi Pengiriman
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm ${
                errors.fullName ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor HP <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="08xxxxxxxxxx"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm ${
                errors.address ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/desa"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCity('');
              }}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm bg-white ${
                errors.province ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-xs text-red-500 mt-1">{errors.province}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kota/Kabupaten <span className="text-red-500">*</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!province}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm bg-white ${
                errors.city ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <option value="">Pilih Kota</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kecamatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm ${
                errors.district ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Kecamatan"
            />
            {errors.district && (
              <p className="text-xs text-red-500 mt-1">{errors.district}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Pos <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F4E37] text-sm ${
                errors.postalCode ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Kode pos"
            />
            {errors.postalCode && (
              <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Metode Pengiriman
        </h2>
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                shippingMethod === method.id
                  ? 'border-[#6F4E37] bg-[#F5E6D3]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={method.id}
                checked={shippingMethod === method.id}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="w-4 h-4 text-[#6F4E37] focus:ring-[#6F4E37]"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-500">
                  Estimasi: {method.estimatedDays}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#6F4E37]">
                  {formatRupiah(method.pricePerKg)}/kg
                </p>
                <p className="text-xs text-gray-500">
                  Min: {formatRupiah(method.minPrice)}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.shippingMethod && (
          <p className="text-xs text-red-500 mt-2">{errors.shippingMethod}</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Metode Pembayaran
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? 'border-[#6F4E37] bg-[#F5E6D3]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-[#6F4E37] focus:ring-[#6F4E37]"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                {method.label}
              </span>
            </label>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="text-xs text-red-500 mt-2">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Ringkasan Pesanan
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium">
                {formatRupiah(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Biaya Pengiriman</span>
            <span className="font-medium">
              {shippingMethod ? formatRupiah(finalShippingCost) : '-'}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Diskon ({discountPercent}%)</span>
              <span>-{formatRupiah(discount)}</span>
            </div>
          )}
          {freeShip && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Gratis Ongkir</span>
              <span>-{formatRupiah(shippingCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
            <span>Total</span>
            <span className="text-[#6F4E37]">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 bg-[#2E5A1C] hover:bg-[#234715] text-white rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Buat Pesanan
      </button>
    </form>
  );
}

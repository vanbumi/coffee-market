import { CartItem } from './cart';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  estimatedDays: string;
  pricePerKg: number;
  minPrice: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'qris' | 'cod';
  label: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  voucherCode: string | null;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  summary: OrderSummary;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

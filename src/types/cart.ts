import { Product } from './product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number; // min 1, max 10
}

export interface CartState {
  items: CartItem[];
  voucherCode: string | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_VOUCHER'; payload: { code: string } }
  | { type: 'REMOVE_VOUCHER' }
  | { type: 'LOAD_CART'; payload: CartState };

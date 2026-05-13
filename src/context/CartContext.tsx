'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { CartItem, CartState, CartAction } from '@/types/cart';
import { Product } from '@/types/product';

const initialState: CartState = {
  items: [],
  voucherCode: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { id: product.id, product, quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(quantity, 10) } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        voucherCode: null,
      };
    case 'APPLY_VOUCHER':
      return {
        ...state,
        voucherCode: action.payload.code,
      };
    case 'REMOVE_VOUCHER':
      return {
        ...state,
        voucherCode: null,
      };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  voucherCode: string | null;
  itemCount: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('coffee-cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('coffee-cart', JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const addItem = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const applyVoucher = useCallback(
    (code: string): boolean => {
      const validCodes = ['COFFEE10', 'GRATISONGKIR'];
      if (validCodes.includes(code.toUpperCase())) {
        dispatch({ type: 'APPLY_VOUCHER', payload: { code: code.toUpperCase() } });
        return true;
      }
      return false;
    },
    []
  );

  const removeVoucher = useCallback(() => {
    dispatch({ type: 'REMOVE_VOUCHER' });
  }, []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        voucherCode: state.voucherCode,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyVoucher,
        removeVoucher,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

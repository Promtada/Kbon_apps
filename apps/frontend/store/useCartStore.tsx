'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ---- Types ----------------------------------------------------------------

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  category: string;
  warranty?: string | null;
  features: string[];
  isPublished: boolean;
  mainImageUrl?: string | null;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

// ---- Reducer --------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        // Increment existing quantity by the requested amount
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'HYDRATE':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// ---- Context --------------------------------------------------------------

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'kbon_cart_items';

const initialState: CartState = { items: [] };

// ---- Provider -------------------------------------------------------------

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: CartItem[] = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          dispatch({ type: 'HYDRATE', items: saved });
        }
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  // Persist items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  const addItem = useCallback((product: CartProduct, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [state.items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---- Hook -----------------------------------------------------------------

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
}

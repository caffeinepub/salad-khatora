import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SaladBowl } from '../backend';

interface CartItem {
  product: SaladBowl;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: SaladBowl, quantity: number) => void;
  updateQuantity: (productName: string, quantity: number) => void;
  removeItem: (productName: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: SaladBowl, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.product.name === product.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productName);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.name === productName ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productName: string) => {
    setItems((prev) => prev.filter((item) => item.product.name !== productName));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

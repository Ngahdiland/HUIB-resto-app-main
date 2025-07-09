"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import SessionManager from '@/utils/sessionManager';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  cart: { [id: string]: CartItem };
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'huib_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{ [id: string]: CartItem }>({});
  const [sessionManager] = useState(() => SessionManager.getInstance());

  // Helper to get cart key for session
  const getCartKey = (sessionId: string) => `cart_session_${sessionId}`;

  // Load cart for current session
  useEffect(() => {
    const session = sessionManager.getCurrentSession();
    if (session) {
      const stored = localStorage.getItem(getCartKey(session.sessionId));
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart({});
      }
    } else {
      setCart({});
    }
  }, []);

  // Save cart to localStorage whenever it changes and session exists
  useEffect(() => {
    const session = sessionManager.getCurrentSession();
    if (session) {
      localStorage.setItem(getCartKey(session.sessionId), JSON.stringify(cart));
    }
  }, [cart, sessionManager]);

  // Listen for session changes
  useEffect(() => {
    const handleStorage = () => {
      const session = sessionManager.getCurrentSession();
      if (session) {
        const stored = localStorage.getItem(getCartKey(session.sessionId));
        if (stored) {
          setCart(JSON.parse(stored));
        } else {
          setCart({});
        }
      } else {
        setCart({});
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [sessionManager]);

  const addToCart = (product: CartProduct) => {
    setCart(prev => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity,
        },
      };
    });
  };

  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
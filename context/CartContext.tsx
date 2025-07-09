"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Helper to get cart key for user
  const getCartKey = (email: string) => `cart_${email}`;

  // Load user email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email);
    } else {
      setUserEmail(null);
    }
  }, []);

  // Load cart for user on mount or when userEmail changes
  useEffect(() => {
    if (userEmail) {
      const stored = localStorage.getItem(getCartKey(userEmail));
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart({});
      }
    } else {
      setCart({});
    }
  }, [userEmail]);

  // Save cart to localStorage whenever it changes and userEmail is set
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(getCartKey(userEmail), JSON.stringify(cart));
    }
  }, [cart, userEmail]);

  // Listen for login/logout (user change) in other tabs
  useEffect(() => {
    const handleStorage = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_BASE = 'http://localhost:8080/api/cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    return headers;
  }, [user]);

  // Fetch cart from backend when user changes
  const fetchCart = useCallback(async () => {
    if (!user?.token) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(API_BASE, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user, getHeaders]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (product) => {
    if (!user?.token) {
      // Fallback: local-only for guests
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      return;
    }

    // Optimistic update
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      fetchCart(); // rollback on error
    }
  };

  const removeFromCart = async (id) => {
    // Optimistic update
    setCart(prev => prev.filter(item => item.id !== id));

    if (!user?.token) return;

    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (err) {
      console.error("Failed to remove from cart", err);
      fetchCart();
    }
  };

  const updateQuantity = async (id, delta) => {
    // Optimistic update
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));

    if (!user?.token) return;

    try {
      await fetch(API_BASE, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ productId: id, delta: delta })
      });
    } catch (err) {
      console.error("Failed to update cart", err);
      fetchCart();
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (!user?.token) return;

    try {
      await fetch(API_BASE, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (err) {
      console.error("Failed to clear cart", err);
      fetchCart();
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, toast, showToast, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

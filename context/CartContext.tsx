"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  slug_url?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  concern: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  slug_url?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  addToCart: (product: Product, quantity?: number, openCart?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mohima_cart");
    const savedWishlist = localStorage.getItem("mohima_wishlist");
    
    const timer = setTimeout(() => {
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Error parsing cart storage", e);
        }
      }
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
          console.error("Error parsing wishlist storage", e);
        }
      }
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when cart/wishlist changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mohima_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mohima_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const addToCart = (product: Product, quantity = 1, openCart = true) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          slug_url: product.slug_url,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
    if (openCart) {
      setCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((wId) => wId !== id)
        : [...prevWishlist, id]
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

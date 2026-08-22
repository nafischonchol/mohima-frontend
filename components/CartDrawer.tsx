"use client";

import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const SHIPPING_THRESHOLD = 1500;

export default function CartDrawer() {
  const { cart: cartItems, cartOpen: isOpen, setCartOpen, updateCartQty: onUpdateQuantity, removeFromCart: onRemoveItem } = useCart();
  const onClose = () => setCartOpen(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const remainingForFreeShipping = SHIPPING_THRESHOLD - subtotal;
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col h-full transform transition-transform duration-350 ease-out select-none border-l border-black/[0.05]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#CC826A]" />
              <h2 className="font-serif text-lg font-normal tracking-wider uppercase text-[#121212]">
                Your Shopping Bag ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#121212] hover:opacity-75 transition-opacity"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-full bg-black/[0.03] flex items-center justify-center mb-4">
                  <ShoppingBag size={24} className="text-[#CC826A]/75" />
                </div>
                <h3 className="font-serif text-base font-normal uppercase tracking-wider mb-2">
                  Bag is Empty
                </h3>
                <p className="text-xs text-[#565656] max-w-xs mb-8">
                  Browse our exquisite collections to discover the perfect premium skincare routine items.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#121212] text-[#FAF9F6] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#CC826A] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Shipping Progress */}
                <div className="bg-white p-4 rounded-xl border border-black/[0.04]">
                  <p className="text-xs text-[#565656] mb-2 font-medium">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add{" "}
                        <span className="text-[#CC826A] font-semibold">
                          ৳{remainingForFreeShipping.toLocaleString()}
                        </span>{" "}
                        more for <span className="font-semibold">FREE shipping</span>
                      </>
                    ) : (
                      <span className="text-emerald-600 font-semibold">
                        🎉 You qualify for FREE shipping!
                      </span>
                    )}
                  </p>
                  <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#CC826A] h-full rounded-full transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-black/[0.04]">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-medium tracking-wide text-[#121212] uppercase line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-[#565656] uppercase mt-1">
                            Authentic Care
                          </p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-[#E5E5E5] rounded-full px-2 py-1 bg-white">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="text-[#565656] hover:text-[#CC826A] p-0.5"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold px-2 w-6 text-center text-[#121212]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="text-[#565656] hover:text-[#CC826A] p-0.5"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#121212]">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#565656]/50 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Section (Fixed at bottom) */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#E5E5E5] bg-white px-6 py-6 space-y-4">
              <div className="flex justify-between text-[#121212] font-semibold text-sm">
                <span className="uppercase tracking-widest font-normal text-xs text-[#565656]">
                  Subtotal
                </span>
                <span className="font-bold text-base">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-[#565656]/60 text-center tracking-wide">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/viewCart"
                  onClick={onClose}
                  className="bg-transparent border border-[#D49783] text-[#D49783] text-[10px] sm:text-xs font-bold uppercase tracking-widest py-4 rounded-full hover:bg-[#D49783]/10 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  View Cart
                </Link>
                <button
                  onClick={() => {
                    alert(
                      "Checkout Demo: Thank you for shopping with Mohima Premium Beauty!"
                    );
                  }}
                  className="bg-[#121212] text-[#FAF9F6] text-[10px] sm:text-xs font-bold uppercase tracking-widest py-4 rounded-full hover:bg-[#CC826A] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

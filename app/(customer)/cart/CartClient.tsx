"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartClient() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
    useCartStore.getState().fetchCart();
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-slate-500 font-medium">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center min-h-[400px]">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingCart size={40} strokeWidth={1.5} className="text-slate-400 dark:text-slate-500 ml-[-4px]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our catalog to find amazing products.</p>
        <Link href="/" className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:scale-105 active:scale-95 duration-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
            {/* Image */}
            <Link href={`/product/${item.slug_url || item.id}`} className="w-full sm:w-28 h-28 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden group block">
               <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
            </Link>
            
            {/* Details */}
            <div className="flex-grow flex flex-col gap-1 w-full">
              {item.brand && <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">{item.brand}</span>}
              <Link href={`/product/${item.slug_url || item.id}`} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{item.name}</h3>
              </Link>
              {item.sku && <span className="text-xs text-slate-500 font-medium mt-1">SKU: {item.sku}</span>}
              <div className="text-lg font-black text-slate-900 dark:text-white mt-1">৳{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-[38px] shadow-sm shrink-0">
                 <button 
                   onClick={() => updateQuantity(item.id, item.quantity - 1)}
                   className="w-[34px] h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                   disabled={item.quantity <= 1}
                 >
                   <Minus size={14} strokeWidth={2.5} />
                 </button>
                 <div className="w-[40px] h-full flex items-center justify-center text-sm font-bold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800">
                   {item.quantity}
                 </div>
                 <button 
                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
                   className="w-[34px] h-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                 >
                   <Plus size={14} strokeWidth={2.5} />
                 </button>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-500 flex items-center gap-1.5 text-sm font-semibold transition-colors bg-slate-100 dark:bg-slate-900/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 sticky top-24 shadow-sm dark:shadow-2xl dark:backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">Order Summary</h3>
          
          <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-300 font-medium mb-6">
            <div className="flex justify-between items-center">
              <span>Subtotal ({items.length} items)</span>
              <span className="text-slate-900 dark:text-white">৳{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">Calculated later</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4 border-t border-slate-200 dark:border-slate-800 mb-8">
            <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-500">৳{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <Link href="/checkout" className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            Proceed to Checkout
          </Link>
          
          <div className="mt-6 flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-500 font-medium text-center bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/50">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Secure B2B checkout
            </p>
            <p>100% Original Korean Cosmetics directly from factory.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

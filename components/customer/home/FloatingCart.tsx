"use client";

import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCustomerAuth } from "@/lib/hooks/useCustomerAuth";

export function FloatingCart() {
  const { isLoggedIn } = useCustomerAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const getCartCount = useCartStore((state) => state.getCartCount);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  
  const getWishlistCount = useWishlistStore((state) => state.getWishlistCount);
  
  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger a wiggle animation periodically to attract attention
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800); // Stop animation after 0.8s
    }, 4000); // Every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
      <Link href="/cart" aria-label="View Cart">
        <div 
          className={`relative flex flex-col items-center justify-center w-[60px] h-[60px] bg-gradient-to-br from-rose-500 to-rose-700 rounded-full shadow-[0_8px_30px_rgb(225,29,72,0.6)] border-[2px] border-white/20 text-white cursor-pointer hover:scale-110 transition-transform ${isAnimating ? 'animate-wiggle' : ''}`}
        >
          {/* Badge */}
          <div className="absolute -top-1 -right-1 min-w-[22px] px-1 h-[22px] bg-slate-950 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-rose-500 shadow-sm">
            {mounted ? getCartCount() : 0}
          </div>
          
          <ShoppingBag size={24} strokeWidth={2.5} className="mt-[-4px]" />
          
          {/* Price Tag */}
          <div className="absolute -bottom-2.5 bg-slate-950 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap border-[1.5px] border-rose-500/50 shadow-md">
            {mounted && isLoggedIn ? `৳${getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'CART'}
          </div>
        </div>
      </Link>

      <Link href="/wishlist" aria-label="View Wishlist">
        <div 
          className={`relative flex flex-col items-center justify-center w-[60px] h-[60px] bg-white dark:bg-slate-900 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-[2px] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:scale-110 transition-transform`}
        >
          {/* Badge */}
          <div className="absolute -top-1 -right-1 min-w-[22px] px-1 h-[22px] bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
            {mounted ? getWishlistCount() : 0}
          </div>
          
          <Heart size={24} strokeWidth={2.5} className="mt-[-4px] text-rose-500" />
          
          {/* Label */}
          <div className="absolute -bottom-2.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap border-[1.5px] border-slate-200 dark:border-slate-800 shadow-md uppercase tracking-wider">
            Saved
          </div>
        </div>
      </Link>
    </div>
  );
}
